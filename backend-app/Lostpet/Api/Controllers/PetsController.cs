using Api.ApiResult;
using Application.Pets.Interfaces;
using Domain.Models.DTOS.Pets.Models;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("users/me/pets")]
[Authorize]
public class PetsController : ControllerBase
{
    private readonly IPetService _petService;

    public PetsController(IPetService petService)
    {
        _petService = petService;
  ***REMOVED***

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _petService.GetAllByUserAsync(userId);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePetModel model)
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _petService.CreateAsync(userId, model);
        return result.Match(
            successStatusCode: 201,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***
}

