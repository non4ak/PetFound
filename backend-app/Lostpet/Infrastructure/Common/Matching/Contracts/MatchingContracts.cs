using System.Text.Json.Serialization;

namespace Infrastructure.Common.Matching.Contracts;

// External JSON contracts. Kept isolated so a change in the ML service response
// shape only affects the client mapping, not the business logic.

public class VectorizeRequestDto
{
    [JsonPropertyName("image_url")]
    public string ImageUrl { get; set; } = string.Empty;
}

public class VectorizeResponseDto
{
    [JsonPropertyName("vector")]
    public double[]? Vector { get; set; }
}

public class MatchRequestDto
{
    [JsonPropertyName("target_vector")]
    public double[] TargetVector { get; set; } = Array.Empty<double>();

    [JsonPropertyName("candidates")]
    public List<MatchCandidateDto> Candidates { get; set; } = new();
}

public class MatchCandidateDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vector")]
    public double[] Vector { get; set; } = Array.Empty<double>();
}

public class MatchScoreDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("similarity_percentage")]
    public double SimilarityPercentage { get; set; }
}
