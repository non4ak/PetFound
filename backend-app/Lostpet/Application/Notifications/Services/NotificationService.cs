using Application.Notifications.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.DTOS.Matches.Responses;
using Domain.Models.DTOS.Notifications.Responses;
using Domain.Models.Enums;
using Infrastructure.Common.Errors;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;

    public NotificationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IPagedList<NotificationResponse>>> GetMyPagedAsync(int userId, int pageNumber, int pageSize, bool? unreadOnly)
    {
        var query = _context.Notifications
            .AsNoTracking()
            .Include(n => n.MatchResult)
                .ThenInclude(m => m!.LostAnnouncement)
            .Include(n => n.MatchResult)
                .ThenInclude(m => m!.FoundAnnouncement)
            .Where(n => n.UserId == userId)
            .AsQueryable();

        if (unreadOnly == true)
        {
            query = query.Where(n => !n.IsRead);
        }

        query = query.OrderByDescending(n => n.CreatedOn).ThenByDescending(n => n.Id);

        var paged = await PagedList<Notification>.CreateAsync(query, pageNumber, pageSize);
        var items = paged.Items.Select(n => MapResponse(n, userId)).ToList();

        IPagedList<NotificationResponse> result = new PagedList<NotificationResponse>(
            currentPage: items,
            count: paged.TotalCount,
            pageNumber: paged.CurrentPage,
            pageSize: paged.PageSize)
        {
            TotalPages = paged.TotalPages
        };

        return Result<IPagedList<NotificationResponse>>.Success(result);
    }

    public async Task<Result<IPagedList<MatchResultResponse>>> GetMyMatchesAsync(int userId, int pageNumber, int pageSize, MatchResultStatus? status)
    {
        var query = _context.MatchResults
            .AsNoTracking()
            .Include(m => m.LostAnnouncement).ThenInclude(a => a.Pet)
            .Include(m => m.FoundAnnouncement).ThenInclude(a => a.Pet)
            .Where(m => m.LostAnnouncement.ReporterUserId == userId
                        || m.FoundAnnouncement.ReporterUserId == userId)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(m => m.Status == status.Value);
        }

        query = query.OrderByDescending(m => m.CreatedOn).ThenByDescending(m => m.Id);

        var paged = await PagedList<MatchResult>.CreateAsync(query, pageNumber, pageSize);
        var items = paged.Items.Select(m => MapMatchResponse(m, userId)).ToList();

        IPagedList<MatchResultResponse> result = new PagedList<MatchResultResponse>(
            currentPage: items,
            count: paged.TotalCount,
            pageNumber: paged.CurrentPage,
            pageSize: paged.PageSize)
        {
            TotalPages = paged.TotalPages
        };

        return Result<IPagedList<MatchResultResponse>>.Success(result);
    }

    private static MatchResultResponse MapMatchResponse(MatchResult m, int userId)
    {
        var isLostSide = m.LostAnnouncement.ReporterUserId == userId;
        var mine = isLostSide ? m.LostAnnouncement : m.FoundAnnouncement;
        var opposite = isLostSide ? m.FoundAnnouncement : m.LostAnnouncement;

        return new MatchResultResponse
        {
            Id = m.Id,
            SimilarityPercentage = (double)m.SimilarityScore * 100d,
            Status = m.Status,
            StatusLabel = m.Status.GetDisplayName(),
            MyAnnouncementId = mine.Id,
            OppositeAnnouncementId = opposite.Id,
            OppositeAnnouncement = new MatchAnnouncementSummary
            {
                Id = opposite.Id,
                PetStatus = opposite.PetStatus,
                PetStatusLabel = opposite.PetStatus.GetDisplayName(),
                Country = opposite.Country,
                City = opposite.City,
                PetPhotoUrl = opposite.Pet.PetPhotoUrl,
                PetName = opposite.Pet.PetName,
                IsActive = opposite.IsActive
            },
            CreatedOn = m.CreatedOn
        };
    }

    public async Task<Result<bool>> MarkAsReadAsync(int userId, int notificationId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
        if (notification is null)
        {
            return Result<bool>.Failure(Error.NotFound("Notification.NotFound", "Notification not found"));
        }

        notification.IsRead = true;
        notification.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public Task<Result<bool>> ApproveMatchAsync(int userId, int matchResultId)
        => SetMatchStatusAsync(userId, matchResultId, MatchResultStatus.Approved);

    public Task<Result<bool>> RejectMatchAsync(int userId, int matchResultId)
        => SetMatchStatusAsync(userId, matchResultId, MatchResultStatus.Rejected);

    private async Task<Result<bool>> SetMatchStatusAsync(int userId, int matchResultId, MatchResultStatus status)
    {
        var match = await _context.MatchResults
            .Include(m => m.LostAnnouncement)
            .Include(m => m.FoundAnnouncement)
            .FirstOrDefaultAsync(m => m.Id == matchResultId);
        if (match is null)
        {
            return Result<bool>.Failure(Error.NotFound("Match.NotFound", "Match not found"));
        }

        var isParticipant = match.LostAnnouncement.ReporterUserId == userId
                            || match.FoundAnnouncement.ReporterUserId == userId;
        if (!isParticipant)
        {
            return Result<bool>.Failure(Error.Forbidden("Match.Forbidden", "You are not a participant of this match"));
        }

        match.Status = status;
        match.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    private static NotificationResponse MapResponse(Notification n, int userId)
    {
        var response = new NotificationResponse
        {
            Id = n.Id,
            Message = n.Message,
            Type = n.Type,
            TypeLabel = n.Type.GetDisplayName(),
            IsRead = n.IsRead,
            CreatedOn = n.CreatedOn,
            MatchResultId = n.MatchResultId
        };

        if (n.MatchResult is not null)
        {
            var m = n.MatchResult;
            var oppositeId = m.LostAnnouncement.ReporterUserId == userId
                ? m.FoundAnnouncementId
                : m.LostAnnouncementId;

            response.Match = new MatchInfo
            {
                MatchResultId = m.Id,
                OppositeAnnouncementId = oppositeId,
                SimilarityPercentage = (double)m.SimilarityScore * 100d,
                Status = m.Status,
                StatusLabel = m.Status.GetDisplayName()
            };
        }

        return response;
    }
}
