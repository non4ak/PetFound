using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Common.Matching;

public interface IVectorizationClient
{
    Task<Result<double[]>> VectorizeAsync(string imageUrl, CancellationToken ct);
}
