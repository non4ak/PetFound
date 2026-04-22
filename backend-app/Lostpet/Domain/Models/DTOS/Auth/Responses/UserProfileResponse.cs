using Domain.Models.Enums;

namespace Domain.Models.DTOS.Auth.Responses;

public class UserProfileResponse
{
    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string? SocialNetwork { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public NotificationChannelPreference NotificationChannelPreference { get; set; }

    public IEnumerable<UserProfilePetResponse> Pets { get; set; } = Array.Empty<UserProfilePetResponse>();
}

public class UserProfilePetResponse
{
    public int Id { get; set; }

    public string PetName { get; set; } = string.Empty;

    public PetType PetType { get; set; }

    public PetSex PetSex { get; set; }

    public PetSize PetSize { get; set; }

    public PetAgeCategory PetAgeCategory { get; set; }

    public string? Breed { get; set; }

    public string? PetPhotoUrl { get; set; }
}

