using Application.Matching.Interfaces;
using Infrastructure.Common.Matching;
using Microsoft.Extensions.Options;

namespace Api.BackgroundServices;

public class MatchingPollerBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly MatchingServiceConfig _config;
    private readonly ILogger<MatchingPollerBackgroundService> _logger;

    public MatchingPollerBackgroundService(
        IServiceScopeFactory scopeFactory,
        IOptions<MatchingServiceConfig> config,
        ILogger<MatchingPollerBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _config = config.Value;
        _logger = logger;
  ***REMOVED***

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var interval = TimeSpan.FromSeconds(Math.Max(1, _config.PollIntervalSeconds));

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var processor = scope.ServiceProvider.GetRequiredService<IMatchingProcessingService>();
                await processor.ProcessPendingBatchAsync(stoppingToken);
          ***REMOVED***
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Matching poller iteration failed");
          ***REMOVED***

            try
            {
                await Task.Delay(interval, stoppingToken);
          ***REMOVED***
            catch (OperationCanceledException)
            {
                break;
          ***REMOVED***
      ***REMOVED***
  ***REMOVED***
}
