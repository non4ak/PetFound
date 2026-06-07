namespace Infrastructure.Common.Matching;

// Public types used by the Application layer (isolated from external JSON contracts).
public record MatchCandidateRequest(int Id, double[] Vector);

public record MatchCandidateScore(int Id, double SimilarityPercentage);
