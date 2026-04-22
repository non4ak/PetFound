using Domain.Models.Enums;

namespace Domain.Models.DTOS.AdminUsers.Responses;

public class AdminUserDetailsDto
{
    public int Id { get; set; }

    public string? UserName { get; set; }

    public string? Email { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? PhoneNumber { get; set; }

    public string? SocialNetwork { get; set; }

    public NotificationChannelPreference NotificationChannelPreference { get; set; }

    public DateTimeOffset RegisteredAt { get; set; }

    public bool EmailConfirmed { get; set; }

    public bool PhoneNumberConfirmed { get; set; }

    public bool LockoutEnabled { get; set; }

    public DateTimeOffset? LockoutEnd { get; set; }

    public int AccessFailedCount { get; set; }

    public bool TwoFactorEnabled { get; set; }

    public IEnumerable<string> Roles { get; set; } = Array.Empty<string>();
}

