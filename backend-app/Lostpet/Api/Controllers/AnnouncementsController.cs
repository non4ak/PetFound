using Api.ApiResult;
using Application.Announcements.Interfaces;
using Domain.Models.DTOS.Announcements.Models;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("announcements")]
[Authorize]
public class AnnouncementsController : ControllerBase
{
    private readonly IAnnouncementService _announcementService;

    public AnnouncementsController(IAnnouncementService announcementService)
    {
        _announcementService = announcementService;
  ***REMOVED***

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] UpdateAnnouncementModel model)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _announcementService.UpdateAsync(userIdResult.Value, id, model);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpPost("{id:int}/archive")]
    public async Task<IActionResult> ArchiveAsync([FromRoute] int id)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _announcementService.ArchiveAsync(userIdResult.Value, id);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpPost("{id:int}/restore")]
    public async Task<IActionResult> RestoreAsync([FromRoute] int id)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _announcementService.RestoreAsync(userIdResult.Value, id);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] int id)
    {
        var result = await _announcementService.GetByIdAsync(id);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpGet]
    public async Task<IActionResult> GetPagedAsync([FromQuery] AnnouncementListQueryModel query, [FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 20)
    {
        var result = await _announcementService.GetPagedAsync(pageNumber, pageSize, query);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpGet("mine")]
    public async Task<IActionResult> GetMineAsync([FromQuery] AnnouncementListQueryModel query, [FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 20)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _announcementService.GetMyPagedAsync(userIdResult.Value, pageNumber, pageSize, query);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAnnouncementModel model)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _announcementService.CreateAsync(userIdResult.Value, model);
        return result.Match(
            successStatusCode: 201,
            includeBody: true,
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

