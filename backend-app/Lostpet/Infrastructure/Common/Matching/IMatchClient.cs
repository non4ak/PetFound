using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Common.Matching;

public interface IMatchClient
{
    Task<Result<IReadOnlyList<MatchCandidateScore>>> MatchAsync(
        double[] targetVector,
        IReadOnlyList<MatchCandidateRequest> candidates,
        CancellationToken ct);
}
