using System.Net.Http.Json;
using System.Text.Json;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Matching.Contracts;
using Infrastructure.Common.ResultPattern;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Common.Matching;

public class MatchClient : IMatchClient
{
    private readonly HttpClient _httpClient;
    private readonly MatchingServiceConfig _config;
    private readonly ILogger<MatchClient> _logger;

    public MatchClient(
        HttpClient httpClient,
        IOptions<MatchingServiceConfig> config,
        ILogger<MatchClient> logger)
    {
        _httpClient = httpClient;
        _config = config.Value;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<MatchCandidateScore>>> MatchAsync(
        double[] targetVector,
        IReadOnlyList<MatchCandidateRequest> candidates,
        CancellationToken ct)
    {
        try
        {
            var request = new MatchRequestDto
            {
                TargetVector = targetVector,
                Candidates = candidates
                    .Select(c => new MatchCandidateDto { Id = c.Id, Vector = c.Vector })
                    .ToList()
            };

            var url = $"{_config.MatchBaseUrl.TrimEnd('/')}/match";
            using var response = await _httpClient.PostAsJsonAsync(url, request, ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Match service returned {StatusCode}", response.StatusCode);
                return Result<IReadOnlyList<MatchCandidateScore>>.Failure(Error.InternalServerError(
                    "Match.HttpError",
                    $"Match service returned {(int)response.StatusCode}"));
            }

            // NOTE: the /match response shape may change. Mapping is isolated here.
            var scores = await response.Content.ReadFromJsonAsync<List<MatchScoreDto>>(cancellationToken: ct);
            if (scores is null)
            {
                return Result<IReadOnlyList<MatchCandidateScore>>.Failure(Error.InternalServerError(
                    "Match.EmptyResponse",
                    "Match service returned an empty body"));
            }

            IReadOnlyList<MatchCandidateScore> mapped = scores
                .Select(s => new MatchCandidateScore(s.Id, s.SimilarityPercentage))
                .ToList();

            return Result<IReadOnlyList<MatchCandidateScore>>.Success(mapped);
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
        {
            _logger.LogWarning(ex, "Match request failed");
            return Result<IReadOnlyList<MatchCandidateScore>>.Failure(Error.InternalServerError(
                "Match.RequestFailed",
                ex.Message));
        }
    }
}
