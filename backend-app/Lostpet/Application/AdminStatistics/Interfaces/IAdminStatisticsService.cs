using Domain.Models.DTOS.AdminStatistics.Responses;
using Infrastructure.Common.ResultPattern;

namespace Application.AdminStatistics.Interfaces;

public interface IAdminStatisticsService
{
    Task<Result<StatisticsSummaryResponse>> GetSummaryAsync();

    Task<Result<StatisticsTimeseriesResponse>> GetTimeseriesAsync(DateTimeOffset from, DateTimeOffset to);
}
