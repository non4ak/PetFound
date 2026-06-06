using Domain.Models.Auth;
using Domain.Models.Enums;

namespace Domain.Models;

public class Announcement : BaseEntity
{
    public AnnouncementPetStatus PetStatus { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public decimal? LastSeenLatitude { get; set; }

    public decimal? LastSeenLongitude { get; set; }

    public string? NearLandmark { get; set; }

    public DateTimeOffset? LastDateWhenSeen { get; set; }

    public string? ApproximateTime { get; set; }

    public string? PetDetails { get; set; }

    public bool IsPhonePublic { get; set; }

    public bool IsTelegramActive { get; set; }

    public bool IsActive { get; set; } = true;

    public AnnouncementProcessingStatus ProcessingStatus { get; set; } = AnnouncementProcessingStatus.Pending;

    public double[]? Vector { get; set; }

    public int ProcessingRetryCount { get; set; }

    public DateTimeOffset? VectorizedOn { get; set; }

    public int ReporterUserId { get; set; }

    public ApplicationUser ReporterUser { get; set; } = null!;

    public int PetId { get; set; }

    public Pet Pet { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public ICollection<MatchResult> MatchResultsAsLost { get; set; } = new List<MatchResult>();

    public ICollection<MatchResult> MatchResultsAsFound { get; set; } = new List<MatchResult>();
}
