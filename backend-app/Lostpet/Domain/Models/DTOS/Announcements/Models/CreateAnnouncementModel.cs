using Domain.Models.Enums;

namespace Domain.Models.DTOS.Announcements.Models;

public class CreateAnnouncementModel
{
    public int? PetId { get; set; }

    public string? PetName { get; set; }

    public PetType? PetType { get; set; }

    public PetSex? PetSex { get; set; }

    public PetSize? PetSize { get; set; }

    public PetAgeCategory? PetAgeCategory { get; set; }

    public string? Breed { get; set; }

    public string? ChipNumber { get; set; }

    public string? PetPhotoUrl { get; set; }

    public AnnouncementPetStatus PetStatus { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public DateTimeOffset? LastDateWhenSeen { get; set; }

    public string? ApproximateTime { get; set; }

    public string? PetDetails { get; set; }

    public bool IsPhonePublic { get; set; }

    public bool IsTelegramActive { get; set; }

    public string? NearLandmark { get; set; }

    public decimal? LastSeenLatitude { get; set; }

    public decimal? LastSeenLongitude { get; set; }
}

