using Domain.Models.Auth;

namespace Domain.Models;

public class Comment : BaseEntity
{
    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? LocationDescription { get; set; }

    public string CommentMessage { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public DateTimeOffset CommentedAt { get; set; }

    public int AnnouncementId { get; set; }

    public Announcement Announcement { get; set; } = null!;

    public int UserId { get; set; }

    public ApplicationUser Author { get; set; } = null!;

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
