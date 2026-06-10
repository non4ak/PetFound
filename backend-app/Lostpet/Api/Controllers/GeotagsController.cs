using Api.ApiResult;
using Application.Geotags.Interfaces;
using Domain.Models;
using Domain.Models.DTOS.Geotags.Models;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("geotags")]
[Authorize]
public class GeotagsController : ControllerBase
{
    private readonly IGeotagService _geotagService;

    public GeotagsController(IGeotagService geotagService)
    {
        _geotagService = geotagService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPagedAsync([FromQuery] GeotagListQueryModel query, [FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 20)
    {
        var result = await _geotagService.GetPagedAsync(pageNumber, pageSize, query);
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
        var result = await _geotagService.GetByIdAsync(id);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateGeotagModel model)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _geotagService.CreateAsync(userIdResult.Value, model);
        return result.Match(
            successStatusCode: 201,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] UpdateGeotagModel model)
    {
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _geotagService.UpdateAsync(userIdResult.Value, User.IsInRole(UserRoles.Admin), id, model);
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
        var userIdResult = TryGetCurrentUserId();
        if (userIdResult is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _geotagService.DeleteAsync(userIdResult.Value, User.IsInRole(UserRoles.Admin), id);
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
