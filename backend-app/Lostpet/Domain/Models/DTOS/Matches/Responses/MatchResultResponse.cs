using Domain.Models.Enums;

namespace Domain.Models.DTOS.Matches.Responses;

public class MatchResultResponse
{
    public int Id { get; set; }

    public double SimilarityPercentage { get; set; }

    public MatchResultStatus Status { get; set; }

    public string StatusLabel { get; set; } = string.Empty;

    public int MyAnnouncementId { get; set; }

    public int OppositeAnnouncementId { get; set; }

    public MatchAnnouncementSummary OppositeAnnouncement { get; set; } = null!;

    public DateTimeOffset CreatedOn { get; set; }
}

public class MatchAnnouncementSummary
{
    public int Id { get; set; }

    public AnnouncementPetStatus PetStatus { get; set; }

    public string PetStatusLabel { get; set; } = string.Empty;

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? PetPhotoUrl { get; set; }

    public string PetName { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}
