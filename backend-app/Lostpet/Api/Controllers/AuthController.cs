using Api.ApiResult;
using Application.Auth.Interfaces;
using Domain.Models.DTOS.Auth.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
    {
        var result = await _authService.LoginAsync(model);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [AllowAnonymous]
    [HttpPost("login/mobile")]
    public async Task<IActionResult> LoginMobileAsync([FromBody] LoginModel model)
    {
        var result = await _authService.LoginMobileAsync(model);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [AllowAnonymous]
    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogleAsync([FromBody] GoogleLoginModel model)
    {
        var result = await _authService.LoginWithGoogleTokenAsync(model.IdToken);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [AllowAnonymous]
    [HttpPost("google/mobile")]
    public async Task<IActionResult> LoginWithGoogleMobileAsync([FromBody] GoogleLoginModel model)
    {
        var result = await _authService.LoginWithGoogleTokenMobileAsync(model.IdToken);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [AllowAnonymous]
    [HttpGet("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        var result = await _authService.RefreshToken();

        if (!result.IsSuccess)
        {
            return ApiResults.ToProblemDetails(result);
        }

        return new StatusCodeResult(StatusCodes.Status200OK);
    }

    [AllowAnonymous]
    [HttpPost("refresh/mobile")]
    public async Task<IActionResult> RefreshTokenMobile([FromBody] MobileRefreshTokenModel model)
    {
        var result = await _authService.RefreshTokenMobile(model.RefreshToken);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        var result = await _authService.RegisterAsync(model);

        return result.Match(
            successStatusCode: 201,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [Authorize]
    [HttpGet("logout")]
    public async Task<IActionResult> LogoutAsync()
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _authService.LogoutAsync(userId);

        return result.Match(
            successStatusCode: 200,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> ProfileAsync()
    {
        var email = User.FindFirst("email")?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value;
        var result = await _authService.GetUserProfile(email);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfileAsync([FromBody] UpdateProfileModel model)
    {
        var id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(id, out var userId))
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
        }

        var result = await _authService.UpdateUserProfile(userId, model);
        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }

    [AllowAnonymous]
    [HttpGet("email-confirmation")]
    public async Task<IActionResult> ConfirmEmailAsync([FromQuery] string email, string token)
    {
        await _authService.ConfirmEmailAsync(email, token);

        return Redirect(_configuration["ApplicationURLs:FrontEnd"]);
    }

    [AllowAnonymous]
    [HttpGet("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromQuery] string email)
    {
        var result = await _authService.ForgotPassword(email);

        return result.Match(
            successStatusCode: 200,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails);
    }

    [AllowAnonymous]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ForgotPasswordModel model)
    {
        var result = await _authService.ResetPasswordAsync(model.Email, model.PasswordToken, model.NewPassword);

        return result.Match(
            successStatusCode: 204,
            includeBody: false,
            message: "null",
            failure: ApiResults.ToProblemDetails);
    }
}
