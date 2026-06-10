using Api.ApiResult;
using Application.Comments.Interfaces;
using Domain.Models.DTOS.Comments.Models;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("announcements/{announcementId:int}/comments")]
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetThreadAsync(
        [FromRoute] int announcementId,
        [FromQuery] int pageNumber = 0,
        [FromQuery] int pageSize = 20)
    {
        var result = await _commentService.GetThreadAsync(announcementId, pageNumber, pageSize);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromRoute] int announcementId, [FromBody] CreateCommentModel model)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _commentService.CreateAsync(userIdResult.Value, announcementId, model);
        return result.Match(
            successStatusCode: 201,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPut("{commentId:int}")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute] int announcementId,
        [FromRoute] int commentId,
        [FromBody] UpdateCommentModel model)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _commentService.UpdateAsync(userIdResult.Value, announcementId, commentId, model);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpDelete("{commentId:int}")]
    public async Task<IActionResult> SoftDeleteAsync(
        [FromRoute] int announcementId,
        [FromRoute] int commentId)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _commentService.SoftDeleteAsync(userIdResult.Value, announcementId, commentId);
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
