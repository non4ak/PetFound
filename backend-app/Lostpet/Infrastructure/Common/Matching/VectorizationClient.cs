using System.Net.Http.Json;
using System.Text.Json;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Matching.Contracts;
using Infrastructure.Common.ResultPattern;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Common.Matching;

public class VectorizationClient : IVectorizationClient
{
    private readonly HttpClient _httpClient;
    private readonly MatchingServiceConfig _config;
    private readonly ILogger<VectorizationClient> _logger;

    public VectorizationClient(
        HttpClient httpClient,
        IOptions<MatchingServiceConfig> config,
        ILogger<VectorizationClient> logger)
    {
        _httpClient = httpClient;
        _config = config.Value;
        _logger = logger;
  ***REMOVED***

    public async Task<Result<double[]>> VectorizeAsync(string imageUrl, CancellationToken ct)
    {
        try
        {
            var request = new VectorizeRequestDto { ImageUrl = imageUrl };

            using var response = await _httpClient.PostAsJsonAsync(_config.VectorizationBaseUrl, request, ct);

            if (!response.IsSuccessStatusCode)
            {
                var statusCode = (int)response.StatusCode;
                _logger.LogWarning("Vectorization service returned {StatusCode} for {ImageUrl}", statusCode, imageUrl);

                // 400 (cannot download image) and 422 (no animal detected) are deterministic
                // photo failures - retrying will not help. Signal them as Validation errors
                // so the processing service can mark the announcement as PhotoFailed at once.
                if (statusCode is 400 or 422)
                {
                    return Result<double[]>.Failure(Error.Validation(
                        "Vectorization.PhotoRejected",
                        $"Vectorization service rejected the photo with status {statusCode}"));
              ***REMOVED***

                return Result<double[]>.Failure(Error.InternalServerError(
                    "Vectorization.HttpError",
                    $"Vectorization service returned {statusCode}"));
          ***REMOVED***

            var payload = await response.Content.ReadFromJsonAsync<VectorizeResponseDto>(cancellationToken: ct);
            if (payload?.Vector is null)
            {
                return Result<double[]>.Failure(Error.InternalServerError(
                    "Vectorization.EmptyResponse",
                    "Vectorization service returned an empty body"));
          ***REMOVED***

            return Result<double[]>.Success(payload.Vector);
      ***REMOVED***
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
        {
            _logger.LogWarning(ex, "Vectorization request failed for {ImageUrl}", imageUrl);
            return Result<double[]>.Failure(Error.InternalServerError(
                "Vectorization.RequestFailed",
                ex.Message));
      ***REMOVED***
  ***REMOVED***
}
