using Api.ApiResult;
using Application.Notifications.Interfaces;
using Domain.Models.Enums;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("matches")]
[Authorize]
public class MatchesController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public MatchesController(INotificationService notificationService)
    {
        _notificationService = notificationService;
  ***REMOVED***

    [HttpGet]
    public async Task<IActionResult> GetMineAsync(
        [FromQuery] MatchResultStatus? status,
        [FromQuery] int pageNumber = 0,
        [FromQuery] int pageSize = 20)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _notificationService.GetMyMatchesAsync(userIdResult.Value, pageNumber, pageSize, status);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpPost("{id:int}/approve")]
    public async Task<IActionResult> ApproveAsync([FromRoute] int id)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _notificationService.ApproveMatchAsync(userIdResult.Value, id);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpPost("{id:int}/reject")]
    public async Task<IActionResult> RejectAsync([FromRoute] int id)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _notificationService.RejectMatchAsync(userIdResult.Value, id);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    private int? TryGetCurrentUserId()
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(id, out var userId) ? userId : null;
  ***REMOVED***
}
