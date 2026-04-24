using Domain.Models.Enums;

namespace Domain.Models.DTOS.AdminUsers.Responses;

public class AdminUserListItemDto
{
    public int Id { get; set; }

    public string? UserName { get; set; }

    public string? Email { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? PhoneNumber { get; set; }

    public string? SocialNetwork { get; set; }

    public NotificationChannelPreference NotificationChannelPreference { get; set; }

    public string NotificationChannelPreferenceLabel { get; set; } = string.Empty;

    public DateTimeOffset RegisteredAt { get; set; }

    public bool IsDeactivated { get; set; }

    public DateTimeOffset? LockoutEnd { get; set; }

    public IEnumerable<string> Roles { get; set; } = Array.Empty<string>();
}

