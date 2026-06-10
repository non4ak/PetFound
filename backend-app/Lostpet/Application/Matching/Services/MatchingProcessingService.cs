using Application.Matching.Interfaces;
using Domain.Models;
using Domain.Models.Enums;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Matching;
using Infrastructure.Common.Notifications;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Application.Matching.Services;

public class MatchingProcessingService : IMatchingProcessingService
{
    private readonly ApplicationDbContext _context;
    private readonly IVectorizationClient _vectorizationClient;
    private readonly IMatchClient _matchClient;
    private readonly IPushNotificationSender _pushNotificationSender;
    private readonly MatchingServiceConfig _config;
    private readonly ILogger<MatchingProcessingService> _logger;

    public MatchingProcessingService(
        ApplicationDbContext context,
        IVectorizationClient vectorizationClient,
        IMatchClient matchClient,
        IPushNotificationSender pushNotificationSender,
        IOptions<MatchingServiceConfig> config,
        ILogger<MatchingProcessingService> logger)
    {
        _context = context;
        _vectorizationClient = vectorizationClient;
        _matchClient = matchClient;
        _pushNotificationSender = pushNotificationSender;
        _config = config.Value;
        _logger = logger;
    }

    public async Task ProcessPendingBatchAsync(CancellationToken ct)
    {
        // Newly created announcements awaiting vectorization.
        var pending = await _context.Announcements
            .Include(a => a.Pet)
            .Where(a => a.ProcessingStatus == AnnouncementProcessingStatus.Pending)
            .OrderBy(a => a.CreatedOn)
            .Take(_config.BatchSize)
            .ToListAsync(ct);

        foreach (var announcement in pending)
        {
            if (ct.IsCancellationRequested)
            {
                return;
            }

            try
            {
                await ProcessOneAsync(announcement, ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process announcement {Id}", announcement.Id);
            }
        }

        // Recovery: announcements that were vectorized but matching did not complete
        // (e.g. /match was unavailable). Re-run only the matching stage.
        var vectorizedPending = await _context.Announcements
            .Include(a => a.Pet)
            .Where(a => a.ProcessingStatus == AnnouncementProcessingStatus.Vectorized
                        && a.Vector != null && a.Vector.Length > 0)
            .OrderBy(a => a.CreatedOn)
            .Take(_config.BatchSize)
            .ToListAsync(ct);

        foreach (var announcement in vectorizedPending)
        {
            if (ct.IsCancellationRequested)
            {
                return;
            }

            try
            {
                await RunMatchingAsync(announcement, ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to run matching for announcement {Id}", announcement.Id);
            }
        }
    }

    private async Task ProcessOneAsync(Announcement announcement, CancellationToken ct)
    {
        var photoUrl = announcement.Pet?.PetPhotoUrl;
        if (string.IsNullOrWhiteSpace(photoUrl))
        {
            // No photo to vectorize - leave as Pending until a photo appears.
            _logger.LogInformation("Announcement {Id} has no pet photo, skipping vectorization", announcement.Id);
            return;
        }

        var vectorResult = await _vectorizationClient.VectorizeAsync(photoUrl, ct);

        if (!vectorResult.IsSuccess)
        {
            // Deterministic rejection (image not downloadable / no animal detected):
            // retrying will not change the outcome, fail fast and notify the user.
            if (vectorResult.Error.Type == ErrorType.Validation)
            {
                MarkPhotoFailed(announcement);
                announcement.LastModifiedOn = DateTimeOffset.UtcNow;
                await _context.SaveChangesAsync(ct);
                return;
            }

            announcement.ProcessingRetryCount++;
            if (announcement.ProcessingRetryCount >= _config.MaxRetries)
            {
                MarkPhotoFailed(announcement);
            }

            announcement.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
        }

        var vector = vectorResult.Value;
        if (vector.Length == 0 || vector.All(v => v == 0d))
        {
            // Deterministic "cannot process photo" answer - no point retrying.
            MarkPhotoFailed(announcement);
            announcement.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
        }

        announcement.Vector = vector;
        announcement.ProcessingStatus = AnnouncementProcessingStatus.Vectorized;
        announcement.VectorizedOn = DateTimeOffset.UtcNow;
        announcement.ProcessingRetryCount = 0;
        announcement.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(ct);

        await RunMatchingAsync(announcement, ct);
    }

    private async Task RunMatchingAsync(Announcement target, CancellationToken ct)
    {
        if (!target.IsActive || target.Vector is null || target.Vector.Length == 0)
        {
            target.ProcessingStatus = AnnouncementProcessingStatus.Matched;
            target.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
        }

        var opposite = target.PetStatus == AnnouncementPetStatus.Lost
            ? AnnouncementPetStatus.Found
            : AnnouncementPetStatus.Lost;

        var targetCity = target.City?.Trim().ToLower();

        var query = _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .Where(a => a.Id != target.Id)
            .Where(a => a.ReporterUserId != target.ReporterUserId)
            .Where(a => a.IsActive)
            .Where(a => a.PetStatus == opposite)
            .Where(a => a.City != null && targetCity != null && a.City.ToLower() == targetCity)
            .Where(a => a.Pet.PetType == target.Pet.PetType)
            .Where(a => a.ProcessingStatus == AnnouncementProcessingStatus.Vectorized
                        || a.ProcessingStatus == AnnouncementProcessingStatus.Matched)
            .Where(a => a.Vector != null && a.Vector.Length > 0);

        // Optional narrowing (kept conservative: only when target has a definite value).
        if (target.Pet.PetSex != PetSex.Unknown)
        {
            query = query.Where(a => a.Pet.PetSex == target.Pet.PetSex);
        }

        var candidatesRaw = await query
            .Select(a => new { a.Id, a.Vector })
            .ToListAsync(ct);

        if (candidatesRaw.Count == 0)
        {
            target.ProcessingStatus = AnnouncementProcessingStatus.Matched;
            target.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
        }

        var candidates = candidatesRaw
            .Select(c => new MatchCandidateRequest(c.Id, c.Vector!))
            .ToList();

        var matchResult = await _matchClient.MatchAsync(target.Vector, candidates, ct);
        if (!matchResult.IsSuccess)
        {
            // Leave the announcement as Vectorized so the recovery branch retries matching later.
            _logger.LogWarning("Matching call failed for announcement {Id}, will retry", target.Id);
            return;
        }

        var strong = matchResult.Value
            .Where(s => s.SimilarityPercentage >= _config.SimilarityThresholdPercent)
            .ToList();

        var pendingPushNotifications = new List<PendingMatchPushNotification>();
        foreach (var score in strong)
        {
            var createdNotifications = await CreateMatchAsync(target, score, ct);
            pendingPushNotifications.AddRange(createdNotifications);
        }

        target.ProcessingStatus = AnnouncementProcessingStatus.Matched;
        target.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(ct);

        await SendMatchPushNotificationsAsync(pendingPushNotifications, ct);
    }

    private async Task<IReadOnlyList<PendingMatchPushNotification>> CreateMatchAsync(
        Announcement target,
        MatchCandidateScore score,
        CancellationToken ct)
    {
        int lostId;
        int foundId;
        if (target.PetStatus == AnnouncementPetStatus.Lost)
        {
            lostId = target.Id;
            foundId = score.Id;
        }
        else
        {
            lostId = score.Id;
            foundId = target.Id;
        }

        var exists = await _context.MatchResults
            .AnyAsync(m => m.LostAnnouncementId == lostId && m.FoundAnnouncementId == foundId, ct);
        if (exists)
        {
            return Array.Empty<PendingMatchPushNotification>();
        }

        var lost = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == lostId, ct);
        var found = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == foundId, ct);
        if (lost is null || found is null)
        {
            return Array.Empty<PendingMatchPushNotification>();
        }

        var now = DateTimeOffset.UtcNow;
        var match = new MatchResult
        {
            LostAnnouncementId = lostId,
            FoundAnnouncementId = foundId,
            SimilarityScore = (decimal)(score.SimilarityPercentage / 100d),
            Status = MatchResultStatus.Pending,
            CreatedOn = now,
            LastModifiedOn = now
        };
        await _context.MatchResults.AddAsync(match, ct);

        var percentLabel = Math.Round(score.SimilarityPercentage);
        const string pushBody = "We found an announcement that may match your pet.";
        var recipients = new[]
        {
            new PendingMatchPushNotification(
                lost.ReporterUserId,
                foundId,
                pushBody),
            new PendingMatchPushNotification(
                found.ReporterUserId,
                lostId,
                pushBody)
        }
        .DistinctBy(notification => notification.UserId)
        .ToList();

        foreach (var recipient in recipients)
        {
            match.Notifications.Add(new Notification
            {
                UserId = recipient.UserId,
                Type = NotificationType.MatchFound,
                Message = $"Possible match found with announcement #{recipient.OppositeAnnouncementId} ({percentLabel}%)",
                IsRead = false,
                CreatedOn = now,
                LastModifiedOn = now
            });
        }

        return recipients;
    }

    private async Task SendMatchPushNotificationsAsync(
        IReadOnlyList<PendingMatchPushNotification> pendingNotifications,
        CancellationToken ct)
    {
        if (pendingNotifications.Count == 0)
        {
            return;
        }

        var userIds = pendingNotifications
            .Select(notification => notification.UserId)
            .Distinct()
            .ToList();
        var deviceKeys = await _context.Users
            .AsNoTracking()
            .Where(user => userIds.Contains(user.Id) && user.DeviceKey != null)
            .ToDictionaryAsync(user => user.Id, user => user.DeviceKey!, ct);

        foreach (var pendingNotification in pendingNotifications)
        {
            if (!deviceKeys.TryGetValue(pendingNotification.UserId, out var deviceKey))
            {
                continue;
            }

            var data = new Dictionary<string, string>
            {
                ["type"] = ((int)NotificationType.MatchFound).ToString(),
                ["typeLabel"] = "MatchFound",
                ["notificationType"] = ((int)NotificationType.MatchFound).ToString(),
                ["oppositeAnnouncementId"] = pendingNotification.OppositeAnnouncementId.ToString(),
                ["announcementId"] = pendingNotification.OppositeAnnouncementId.ToString()
            };
            var notification = new PushNotificationMessage(
                deviceKey,
                "Possible match found",
                pendingNotification.Body,
                data);

            try
            {
                var result = await _pushNotificationSender.SendAsync(notification, ct);
                if (result == PushNotificationSendResult.InvalidDeviceKey)
                {
                    await ClearInvalidDeviceKeyAsync(
                        pendingNotification.UserId,
                        deviceKey,
                        ct);
                }
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send match push notification. UserId: {UserId}, OppositeAnnouncementId: {OppositeAnnouncementId}, DeviceKeyLength: {DeviceKeyLength}",
                    pendingNotification.UserId,
                    pendingNotification.OppositeAnnouncementId,
                    deviceKey.Length);
            }
        }
    }

    private async Task ClearInvalidDeviceKeyAsync(
        int userId,
        string invalidDeviceKey,
        CancellationToken ct)
    {
        await _context.Users
            .Where(user => user.Id == userId && user.DeviceKey == invalidDeviceKey)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(user => user.DeviceKey, (string?)null),
                ct);

        _logger.LogInformation(
            "Cleared an invalid Firebase device key. UserId: {UserId}, DeviceKeyLength: {DeviceKeyLength}",
            userId,
            invalidDeviceKey.Length);
    }

    private void MarkPhotoFailed(Announcement announcement)
    {
        var now = DateTimeOffset.UtcNow;
        announcement.ProcessingStatus = AnnouncementProcessingStatus.PhotoFailed;
        _context.Notifications.Add(new Notification
        {
            UserId = announcement.ReporterUserId,
            Type = NotificationType.PhotoProcessingFailed,
            Message = "Не вдалося обробити фото, завантажте чіткіше",
            IsRead = false,
            CreatedOn = now,
            LastModifiedOn = now
        });
    }

    private sealed record PendingMatchPushNotification(
        int UserId,
        int OppositeAnnouncementId,
        string Body);
}
