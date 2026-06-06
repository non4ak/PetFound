using Api.ApiResult;
using Application.Notifications.Interfaces;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMineAsync(
        [FromQuery] bool? unreadOnly,
        [FromQuery] int pageNumber = 0,
        [FromQuery] int pageSize = 20)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _notificationService.GetMyPagedAsync(userIdResult.Value, pageNumber, pageSize, unreadOnly);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost("{id:int}/read")]
    public async Task<IActionResult> MarkAsReadAsync([FromRoute] int id)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _notificationService.MarkAsReadAsync(userIdResult.Value, id);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    private int? TryGetCurrentUserId()
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(id, out var userId) ? userId : null;
    }
}
