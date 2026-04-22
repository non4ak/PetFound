using Domain.Models.Enums;

namespace Domain.Models.DTOS.Onboarding.Models;

public class CompleteOnboardingModel
{
    public string? UserName { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? SocialNetwork { get; set; }

    public NotificationChannelPreference? NotificationChannelPreference { get; set; }

    public string? PetPhotoUrl { get; set; }

    public string? PetName { get; set; }

    public PetType? PetType { get; set; }

    public PetSex? PetSex { get; set; }

    public PetSize? PetSize { get; set; }

    public PetAgeCategory? PetAgeCategory { get; set; }

    public string? Breed { get; set; }

    public string? ChipNumber { get; set; }

    public string? Description { get; set; }
}

