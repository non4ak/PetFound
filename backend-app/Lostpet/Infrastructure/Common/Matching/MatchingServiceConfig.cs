namespace Infrastructure.Common.Matching;

public class MatchingServiceConfig
{
    public string VectorizationBaseUrl { get; set; } = string.Empty;

    public string MatchBaseUrl { get; set; } = string.Empty;

    public int TimeoutSeconds { get; set; } = 30;

    public int MaxRetries { get; set; } = 10;

    public double SimilarityThresholdPercent { get; set; } = 70;

    public int PollIntervalSeconds { get; set; } = 10;

    public int BatchSize { get; set; } = 20;
}
