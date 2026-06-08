using Domain.Models.Enums;

namespace Domain.Models.DTOS.Announcements.Responses;

public class AnnouncementDetailsResponse
{
    public int Id { get; set; }

    public int PetId { get; set; }

    public AnnouncementPetStatus PetStatus { get; set; }

    public string PetStatusLabel { get; set; } = string.Empty;

    public string? Country { get; set; }

    public string? City { get; set; }

    public DateTimeOffset? LastDateWhenSeen { get; set; }

    public string? ApproximateTime { get; set; }

    public string? PetDetails { get; set; }

    public bool IsPhonePublic { get; set; }

    public bool IsTelegramActive { get; set; }

    public string? PhoneNumber { get; set; }

    public string? SocialNetwork { get; set; }

    public string? NearLandmark { get; set; }

    public decimal? LastSeenLatitude { get; set; }

    public decimal? LastSeenLongitude { get; set; }

    public bool IsActive { get; set; }

    public DateTimeOffset CreatedOn { get; set; }

    public AnnouncementPetInfoResponse Pet { get; set; } = new();
}

public class AnnouncementPetInfoResponse
{
    public int Id { get; set; }

    public string PetName { get; set; } = string.Empty;

    public PetType PetType { get; set; }

    public string PetTypeLabel { get; set; } = string.Empty;

    public PetSex PetSex { get; set; }

    public string PetSexLabel { get; set; } = string.Empty;

    public PetSize PetSize { get; set; }

    public string PetSizeLabel { get; set; } = string.Empty;

    public PetAgeCategory PetAgeCategory { get; set; }

    public string PetAgeCategoryLabel { get; set; } = string.Empty;

    public string? Breed { get; set; }

    public string? ChipNumber { get; set; }

    public string? Description { get; set; }

    public string? PetPhotoUrl { get; set; }
}

