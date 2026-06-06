using Application.Matching.Interfaces;
using Domain.Models;
using Domain.Models.Enums;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Matching;
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
    private readonly MatchingServiceConfig _config;
    private readonly ILogger<MatchingProcessingService> _logger;

    public MatchingProcessingService(
        ApplicationDbContext context,
        IVectorizationClient vectorizationClient,
        IMatchClient matchClient,
        IOptions<MatchingServiceConfig> config,
        ILogger<MatchingProcessingService> logger)
    {
        _context = context;
        _vectorizationClient = vectorizationClient;
        _matchClient = matchClient;
        _config = config.Value;
        _logger = logger;
  ***REMOVED***

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
          ***REMOVED***

            try
            {
                await ProcessOneAsync(announcement, ct);
          ***REMOVED***
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process announcement {Id}", announcement.Id);
          ***REMOVED***
      ***REMOVED***

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
          ***REMOVED***

            try
            {
                await RunMatchingAsync(announcement, ct);
          ***REMOVED***
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to run matching for announcement {Id}", announcement.Id);
          ***REMOVED***
      ***REMOVED***
  ***REMOVED***

    private async Task ProcessOneAsync(Announcement announcement, CancellationToken ct)
    {
        var photoUrl = announcement.Pet?.PetPhotoUrl;
        if (string.IsNullOrWhiteSpace(photoUrl))
        {
            // No photo to vectorize - leave as Pending until a photo appears.
            _logger.LogInformation("Announcement {Id} has no pet photo, skipping vectorization", announcement.Id);
            return;
      ***REMOVED***

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
          ***REMOVED***

            announcement.ProcessingRetryCount++;
            if (announcement.ProcessingRetryCount >= _config.MaxRetries)
            {
                MarkPhotoFailed(announcement);
          ***REMOVED***

            announcement.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
      ***REMOVED***

        var vector = vectorResult.Value;
        if (vector.Length == 0 || vector.All(v => v == 0d))
        {
            // Deterministic "cannot process photo" answer - no point retrying.
            MarkPhotoFailed(announcement);
            announcement.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
      ***REMOVED***

        announcement.Vector = vector;
        announcement.ProcessingStatus = AnnouncementProcessingStatus.Vectorized;
        announcement.VectorizedOn = DateTimeOffset.UtcNow;
        announcement.ProcessingRetryCount = 0;
        announcement.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(ct);

        await RunMatchingAsync(announcement, ct);
  ***REMOVED***

    private async Task RunMatchingAsync(Announcement target, CancellationToken ct)
    {
        if (!target.IsActive || target.Vector is null || target.Vector.Length == 0)
        {
            target.ProcessingStatus = AnnouncementProcessingStatus.Matched;
            target.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
      ***REMOVED***

        var opposite = target.PetStatus == AnnouncementPetStatus.Lost
            ? AnnouncementPetStatus.Found
            : AnnouncementPetStatus.Lost;

        var targetCity = target.City?.Trim().ToLower();

        var query = _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .Where(a => a.Id != target.Id)
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
      ***REMOVED***

        var candidatesRaw = await query
            .Select(a => new { a.Id, a.Vector })
            .ToListAsync(ct);

        if (candidatesRaw.Count == 0)
        {
            target.ProcessingStatus = AnnouncementProcessingStatus.Matched;
            target.LastModifiedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(ct);
            return;
      ***REMOVED***

        var candidates = candidatesRaw
            .Select(c => new MatchCandidateRequest(c.Id, c.Vector!))
            .ToList();

        var matchResult = await _matchClient.MatchAsync(target.Vector, candidates, ct);
        if (!matchResult.IsSuccess)
        {
            // Leave the announcement as Vectorized so the recovery branch retries matching later.
            _logger.LogWarning("Matching call failed for announcement {Id}, will retry", target.Id);
            return;
      ***REMOVED***

        var strong = matchResult.Value
            .Where(s => s.SimilarityPercentage >= _config.SimilarityThresholdPercent)
            .ToList();

        foreach (var score in strong)
        {
            await CreateMatchAsync(target, score, ct);
      ***REMOVED***

        target.ProcessingStatus = AnnouncementProcessingStatus.Matched;
        target.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(ct);
  ***REMOVED***

    private async Task CreateMatchAsync(Announcement target, MatchCandidateScore score, CancellationToken ct)
    {
        int lostId;
        int foundId;
        if (target.PetStatus == AnnouncementPetStatus.Lost)
        {
            lostId = target.Id;
            foundId = score.Id;
      ***REMOVED***
        else
        {
            lostId = score.Id;
            foundId = target.Id;
      ***REMOVED***

        var exists = await _context.MatchResults
            .AnyAsync(m => m.LostAnnouncementId == lostId && m.FoundAnnouncementId == foundId, ct);
        if (exists)
        {
            return;
      ***REMOVED***

        var lost = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == lostId, ct);
        var found = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == foundId, ct);
        if (lost is null || found is null)
        {
            return;
      ***REMOVED***

        var now = DateTimeOffset.UtcNow;
        var match = new MatchResult
        {
            LostAnnouncementId = lostId,
            FoundAnnouncementId = foundId,
            SimilarityScore = (decimal)(score.SimilarityPercentage / 100d),
            Status = MatchResultStatus.Pending,
            CreatedOn = now,
            LastModifiedOn = now
      ***REMOVED***;
        await _context.MatchResults.AddAsync(match, ct);

        var percentLabel = Math.Round(score.SimilarityPercentage);

        match.Notifications.Add(new Notification
        {
            UserId = lost.ReporterUserId,
            Type = NotificationType.MatchFound,
            Message = $"Знайдено можливий збіг з оголошенням #{foundId} ({percentLabel}%)",
            IsRead = false,
            CreatedOn = now,
            LastModifiedOn = now
      ***REMOVED***);

        match.Notifications.Add(new Notification
        {
            UserId = found.ReporterUserId,
            Type = NotificationType.MatchFound,
            Message = $"Знайдено можливий збіг з оголошенням #{lostId} ({percentLabel}%)",
            IsRead = false,
            CreatedOn = now,
            LastModifiedOn = now
      ***REMOVED***);
  ***REMOVED***

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
      ***REMOVED***);
  ***REMOVED***
}
