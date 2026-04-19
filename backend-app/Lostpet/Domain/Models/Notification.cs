using Domain.Models.Auth;
using Domain.Models.Enums;

namespace Domain.Models;

public class Notification : BaseEntity
{
    public string Message { get; set; } = string.Empty;

    public NotificationType Type { get; set; }

    public bool IsRead { get; set; }

    public int UserId { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public int? MatchResultId { get; set; }

    public MatchResult? MatchResult { get; set; }

    public int? CommentId { get; set; }

    public Comment? Comment { get; set; }
}
