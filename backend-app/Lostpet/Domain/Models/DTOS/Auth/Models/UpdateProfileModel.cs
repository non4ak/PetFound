using Domain.Models.Enums;

namespace Domain.Models.DTOS.Auth.Models;

public class UpdateProfileModel
{
    public string? PhoneNumber { get; set; }

    public string? SocialNetwork { get; set; }

    public string? UserPhotoUrl { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public NotificationChannelPreference? NotificationChannelPreference { get; set; }
}

