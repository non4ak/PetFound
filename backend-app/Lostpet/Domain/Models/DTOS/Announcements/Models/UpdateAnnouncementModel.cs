using Domain.Models.Enums;

namespace Domain.Models.DTOS.Announcements.Models;

public class UpdateAnnouncementModel
{
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

    public AnnouncementPetStatus PetStatus { get; set; }
}

