using Domain.Models.DTOS.Announcements.Responses;

namespace Domain.Models.DTOS.AdminAnnouncements.Responses;

public class AdminAnnouncementDetailsDto : AnnouncementDetailsResponse
{
    public int ReporterUserId { get; set; }

    public string ReporterUserName { get; set; } = string.Empty;

    public string? ReporterEmail { get; set; }

    public int CommentsCount { get; set; }
}
