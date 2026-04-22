using Domain.Models.Enums;

namespace Domain.Models.DTOS.AdminUsers.Models;

public class AdminUserUpdateModel
{
    public string? Country { get; set; }

    public string? City { get; set; }

    public string? SocialNetwork { get; set; }

    public string? PhoneNumber { get; set; }

    public NotificationChannelPreference? NotificationChannelPreference { get; set; }
}

