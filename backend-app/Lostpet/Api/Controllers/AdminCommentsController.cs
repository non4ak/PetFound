using Api.ApiResult;
using Application.AdminComments.Interfaces;
using Domain.Models;
using Domain.Models.DTOS.AdminComments.Models;
using Domain.Models.DTOS.Comments.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("admin")]
[Authorize(Roles = UserRoles.Admin)]
public class AdminCommentsController : ControllerBase
{
    private readonly IAdminCommentService _adminCommentService;

    public AdminCommentsController(IAdminCommentService adminCommentService)
    {
        _adminCommentService = adminCommentService;
  ***REMOVED***

    [HttpGet("comments")]
    public async Task<IActionResult> ListAsync(
        [FromQuery] AdminCommentListQueryModel query,
        [FromQuery] int pageNumber = 0,
        [FromQuery] int pageSize = 20)
    {
        var result = await _adminCommentService.ListAsync(query, pageNumber, pageSize);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpPut("announcements/{announcementId:int}/comments/{commentId:int}")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute] int announcementId,
        [FromRoute] int commentId,
        [FromBody] UpdateCommentModel model)
    {
        var result = await _adminCommentService.UpdateAsync(announcementId, commentId, model);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpDelete("announcements/{announcementId:int}/comments/{commentId:int}")]
    public async Task<IActionResult> SoftDeleteAsync([FromRoute] int announcementId, [FromRoute] int commentId)
    {
        var result = await _adminCommentService.SoftDeleteAsync(announcementId, commentId);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***
}
