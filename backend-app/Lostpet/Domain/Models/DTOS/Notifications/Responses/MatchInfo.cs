using Domain.Models.Enums;

namespace Domain.Models.DTOS.Notifications.Responses;

public class MatchInfo
{
    public int MatchResultId { get; set; }

    public int OppositeAnnouncementId { get; set; }

    public double SimilarityPercentage { get; set; }

    public MatchResultStatus Status { get; set; }

    public string StatusLabel { get; set; } = string.Empty;
}
