using Api.ApiResult;
using Application.AdminUsers.Interfaces;
using Domain.Models;
using Domain.Models.DTOS.AdminUsers.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("admin/users")]
[Authorize(Roles = UserRoles.Admin)]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _adminUserService;

    public AdminUsersController(IAdminUserService adminUserService)
    {
        _adminUserService = adminUserService;
    }

    [HttpGet]
    public async Task<IActionResult> ListAsync([FromQuery] string? search, [FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 20)
    {
        var result = await _adminUserService.ListUsersAsync(search, pageNumber, pageSize);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAsync([FromRoute] int id)
    {
        var result = await _adminUserService.GetUserAsync(id);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] AdminUserUpdateModel model)
    {
        var result = await _adminUserService.UpdateUserAsync(id, model);

        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost("{id:int}/deactivate")]
    public async Task<IActionResult> DeactivateAsync([FromRoute] int id)
    {
        var result = await _adminUserService.DeactivateUserAsync(id);

        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost("{id:int}/activate")]
    public async Task<IActionResult> ActivateAsync([FromRoute] int id)
    {
        var result = await _adminUserService.ActivateUserAsync(id);

        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] int id)
    {
        var result = await _adminUserService.DeleteUserAsync(id);

        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }
}

