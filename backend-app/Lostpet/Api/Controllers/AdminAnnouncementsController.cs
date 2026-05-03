using Api.ApiResult;
using Application.AdminAnnouncements.Interfaces;
using Domain.Models;
using Domain.Models.DTOS.AdminAnnouncements.Models;
using Domain.Models.DTOS.Announcements.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("admin/announcements")]
[Authorize(Roles = UserRoles.Admin)]
public class AdminAnnouncementsController : ControllerBase
{
    private readonly IAdminAnnouncementService _adminAnnouncementService;

    public AdminAnnouncementsController(IAdminAnnouncementService adminAnnouncementService)
    {
        _adminAnnouncementService = adminAnnouncementService;
    }

    [HttpGet]
    public async Task<IActionResult> ListAsync([FromQuery] AdminAnnouncementListQueryModel query, [FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 20)
    {
        var result = await _adminAnnouncementService.ListAsync(query, pageNumber, pageSize);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] int id)
    {
        var result = await _adminAnnouncementService.GetByIdAsync(id);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] UpdateAnnouncementModel model)
    {
        var result = await _adminAnnouncementService.UpdateAsync(id, model);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost("{id:int}/archive")]
    public async Task<IActionResult> ArchiveAsync([FromRoute] int id)
    {
        var result = await _adminAnnouncementService.ArchiveAsync(id);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost("{id:int}/restore")]
    public async Task<IActionResult> RestoreAsync([FromRoute] int id)
    {
        var result = await _adminAnnouncementService.RestoreAsync(id);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }
}
