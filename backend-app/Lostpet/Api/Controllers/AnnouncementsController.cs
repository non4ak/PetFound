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
[Route("users/me/announcements")]
[Authorize]
public class AnnouncementsController : ControllerBase
{
    private readonly IAnnouncementService _announcementService;

    public AnnouncementsController(IAnnouncementService announcementService)
    {
        _announcementService = announcementService;
    }

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
    }

    [HttpGet]
    public async Task<IActionResult> GetPagedAsync([FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 20)
    {
        var result = await _announcementService.GetPagedAsync(pageNumber, pageSize);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAnnouncementModel model)
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _announcementService.CreateAsync(userId, model);
        return result.Match(
            successStatusCode: 201,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }
}

