using System.Security.Claims;
using Api.ApiResult;
using Application.Photos.Interfaces;
using Domain.Models.DTOS.Photos.Models;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("users/me/photos")]
[Authorize]
public class PhotosController : ControllerBase
{
    private readonly IPhotoUploadService _photoUploadService;

    public PhotosController(IPhotoUploadService photoUploadService)
    {
        _photoUploadService = photoUploadService;
  ***REMOVED***

    [HttpPost("upload-sas")]
    public async Task<IActionResult> CreateUploadSasAsync([FromBody] CreatePhotoUploadSasModel model)
    {
        int? userId = TryGetCurrentUserId();
        if (userId is null)
        {
            return ApiResults.ToProblemDetails(Result.Failure(UserErrors.Unauthorized()));
      ***REMOVED***

        var result = await _photoUploadService.CreateUploadSasAsync(userId.Value, model);
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
  ***REMOVED***

    private int? TryGetCurrentUserId()
    {
        string? id = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(id, out int userId) ? userId : null;
  ***REMOVED***
}
