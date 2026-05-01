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

    public int? ParentCommentId { get; set; }

    public Comment? ParentComment { get; set; }

    public ICollection<Comment> Replies { get; set; } = new List<Comment>();

    public bool IsDeleted { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
