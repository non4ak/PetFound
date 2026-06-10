using Api.ApiResult;
using Application.Meta.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("meta/enums")]
[AllowAnonymous]
public class MetaController : ControllerBase
{
    private readonly IEnumMetadataService _enumMetadataService;

    public MetaController(IEnumMetadataService enumMetadataService)
    {
        _enumMetadataService = enumMetadataService;
    }

    [HttpGet]
    public async Task<IActionResult> GetEnumsAsync()
    {
        var result = await _enumMetadataService.GetAllAsync();
        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails
        );
    }
}

