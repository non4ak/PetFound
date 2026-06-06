namespace Application.Matching.Interfaces;

public interface IMatchingProcessingService
{
    Task ProcessPendingBatchAsync(CancellationToken ct);
}
