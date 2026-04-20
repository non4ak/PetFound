using Api.ApiResult;
using Application.Onboarding.Interfaces;
using Domain.Models.DTOS.Onboarding.Models;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("users/me/onboarding")]
[Authorize]
public class OnboardingController : ControllerBase
{
    private readonly IOnboardingService _onboardingService;

    public OnboardingController(IOnboardingService onboardingService)
    {
        _onboardingService = onboardingService;
  ***REMOVED***

    [HttpPut]
    public async Task<IActionResult> CompleteAsync([FromBody] CompleteOnboardingModel model)
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _onboardingService.CompleteAsync(userId, model);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***
}

