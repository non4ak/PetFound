using Application.AdminStatistics.Interfaces;
using Domain.Models.DTOS.AdminStatistics.Responses;
using Domain.Models.Enums;
using Infrastructure.Common.Errors;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.AdminStatistics.Services;

public class AdminStatisticsService : IAdminStatisticsService
{
    private readonly ApplicationDbContext _context;

    public AdminStatisticsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<StatisticsSummaryResponse>> GetSummaryAsync()
    {
        var now = DateTimeOffset.UtcNow;
        var thirtyDaysAgo = now.AddDays(-30);

        var totalUsers = await _context.Users.CountAsync();
        var usersOnboarded = await _context.Users.CountAsync(u => u.IsOnboardingCompleted);
        var usersRegisteredLast30Days = await _context.Users.CountAsync(u => u.RegisteredAt >= thirtyDaysAgo);

        var totalAnnouncements = await _context.Announcements.CountAsync();
        var activeAnnouncements = await _context.Announcements.CountAsync(a => a.IsActive);
        var archivedAnnouncements = totalAnnouncements - activeAnnouncements;
        var lostAnnouncements = await _context.Announcements.CountAsync(a => a.PetStatus == AnnouncementPetStatus.Lost);
        var foundAnnouncements = await _context.Announcements.CountAsync(a => a.PetStatus == AnnouncementPetStatus.Found);
        var announcementsLast30Days = await _context.Announcements.CountAsync(a => a.CreatedOn >= thirtyDaysAgo);

        var totalComments = await _context.Comments.CountAsync(c => !c.IsDeleted);
        var commentsLast30Days = await _context.Comments.CountAsync(c => !c.IsDeleted && c.CommentedAt >= thirtyDaysAgo);

        var totalPets = await _context.Pets.CountAsync();

        return Result<StatisticsSummaryResponse>.Success(new StatisticsSummaryResponse
        {
            TotalUsers = totalUsers,
            UsersOnboarded = usersOnboarded,
            UsersRegisteredLast30Days = usersRegisteredLast30Days,
            TotalAnnouncements = totalAnnouncements,
            ActiveAnnouncements = activeAnnouncements,
            ArchivedAnnouncements = archivedAnnouncements,
            LostAnnouncements = lostAnnouncements,
            FoundAnnouncements = foundAnnouncements,
            AnnouncementsLast30Days = announcementsLast30Days,
            TotalComments = totalComments,
            CommentsLast30Days = commentsLast30Days,
            TotalPets = totalPets
        });
    }

    public async Task<Result<StatisticsTimeseriesResponse>> GetTimeseriesAsync(DateTimeOffset from, DateTimeOffset to)
    {
        if (to < from)
        {
            return Result<StatisticsTimeseriesResponse>.Failure(Error.Validation("Statistics.InvalidRange", "'to' must be greater than or equal to 'from'"));
        }

        if ((to - from).TotalDays > 366)
        {
            return Result<StatisticsTimeseriesResponse>.Failure(Error.Validation("Statistics.RangeTooWide", "Range cannot exceed 366 days"));
        }

        var fromDay = new DateTimeOffset(from.UtcDateTime.Date, TimeSpan.Zero);
        var toExclusive = new DateTimeOffset(to.UtcDateTime.Date, TimeSpan.Zero).AddDays(1);

        var announcementTimestamps = await _context.Announcements
            .AsNoTracking()
            .Where(a => a.CreatedOn >= fromDay && a.CreatedOn < toExclusive)
            .Select(a => a.CreatedOn)
            .ToListAsync();

        var userTimestamps = await _context.Users
            .AsNoTracking()
            .Where(u => u.RegisteredAt >= fromDay && u.RegisteredAt < toExclusive)
            .Select(u => u.RegisteredAt)
            .ToListAsync();

        var commentTimestamps = await _context.Comments
            .AsNoTracking()
            .Where(c => !c.IsDeleted && c.CommentedAt >= fromDay && c.CommentedAt < toExclusive)
            .Select(c => c.CommentedAt)
            .ToListAsync();

        var announcements = GroupByDay(announcementTimestamps);
        var users = GroupByDay(userTimestamps);
        var comments = GroupByDay(commentTimestamps);

        return Result<StatisticsTimeseriesResponse>.Success(new StatisticsTimeseriesResponse
        {
            From = fromDay,
            To = toExclusive.AddDays(-1),
            Announcements = FillMissingDays(announcements, fromDay, toExclusive),
            Users = FillMissingDays(users, fromDay, toExclusive),
            Comments = FillMissingDays(comments, fromDay, toExclusive)
        });
    }

    private static List<StatisticsTimeseriesPoint> GroupByDay(IEnumerable<DateTimeOffset> timestamps)
    {
        return timestamps
            .GroupBy(t => t.UtcDateTime.Date)
            .Select(g => new StatisticsTimeseriesPoint { Date = g.Key, Count = g.Count() })
            .ToList();
    }

    private static IEnumerable<StatisticsTimeseriesPoint> FillMissingDays(
        IReadOnlyCollection<StatisticsTimeseriesPoint> points,
        DateTimeOffset fromInclusive,
        DateTimeOffset toExclusive)
    {
        var byDate = points.ToDictionary(p => p.Date, p => p.Count);
        var result = new List<StatisticsTimeseriesPoint>();
        for (var day = fromInclusive.UtcDateTime.Date; day < toExclusive.UtcDateTime.Date; day = day.AddDays(1))
        {
            result.Add(new StatisticsTimeseriesPoint
            {
                Date = day,
                Count = byDate.TryGetValue(day, out var count) ? count : 0
            });
        }
        return result;
    }
}
