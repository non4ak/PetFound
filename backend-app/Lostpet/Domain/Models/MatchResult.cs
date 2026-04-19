using Domain.Models.Enums;

namespace Domain.Models;

public class MatchResult : BaseEntity
{
    public int LostAnnouncementId { get; set; }

    public Announcement LostAnnouncement { get; set; } = null!;

    public int FoundAnnouncementId { get; set; }

    public Announcement FoundAnnouncement { get; set; } = null!;

    public decimal SimilarityScore { get; set; }

    public MatchResultStatus Status { get; set; }

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
