using Domain.Models.Enums;

namespace Domain.Models.DTOS.Notifications.Responses;

public class NotificationResponse
{
    public int Id { get; set; }

    public string Message { get; set; } = string.Empty;

    public NotificationType Type { get; set; }

    public string TypeLabel { get; set; } = string.Empty;

    public bool IsRead { get; set; }

    public DateTimeOffset CreatedOn { get; set; }

    public int? MatchResultId { get; set; }

    public MatchInfo? Match { get; set; }
}
