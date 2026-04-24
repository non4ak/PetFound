using Domain.Models.Enums;

namespace Domain.Models.DTOS.Announcements.Responses;

public class AnnouncementResponse
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

    public string? NearLandmark { get; set; }

    public decimal? LastSeenLatitude { get; set; }

    public decimal? LastSeenLongitude { get; set; }

    public bool IsActive { get; set; }

    public DateTimeOffset CreatedOn { get; set; }
}

