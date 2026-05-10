using Api.ApiResult;
using Application.AdminStatistics.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("admin/statistics")]
[Authorize(Roles = UserRoles.Admin)]
public class AdminStatisticsController : ControllerBase
{
    private readonly IAdminStatisticsService _statisticsService;

    public AdminStatisticsController(IAdminStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
  ***REMOVED***

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaryAsync()
    {
        var result = await _statisticsService.GetSummaryAsync();
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpGet("timeseries")]
    public async Task<IActionResult> GetTimeseriesAsync([FromQuery] DateTimeOffset? from, [FromQuery] DateTimeOffset? to)
    {
        var toValue = to ?? DateTimeOffset.UtcNow;
        var fromValue = from ?? toValue.AddDays(-30);

        var result = await _statisticsService.GetTimeseriesAsync(fromValue, toValue);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***
}
