using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Mvc;

namespace Api.ApiResult;

public static class ResultExtensions
{
    public static IActionResult Match<T>(
        this Result<T> result,
        int successStatusCode,
        bool includeBody,
        string message,
        Func<Result<T>, IActionResult>? failure = null
    )
    {
        if (result.IsSuccess)
        {
            if (includeBody)
            {
                var body = new ApiResponse<T>
                {
                    Message = message,
                    Data = result.Value
              ***REMOVED***;

                return new ObjectResult(body) { StatusCode = successStatusCode };
          ***REMOVED***

            return new StatusCodeResult(successStatusCode);
      ***REMOVED***

        return failure != null
            ? failure(result)
            : ApiResults.ToProblemDetails(result);
  ***REMOVED***
}
