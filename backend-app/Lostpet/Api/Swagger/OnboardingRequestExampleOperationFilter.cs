using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.Swagger;

public class OnboardingRequestExampleOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var isTargetEndpoint =
            string.Equals(context.ApiDescription.HttpMethod, "PUT", StringComparison.OrdinalIgnoreCase) &&
            string.Equals(context.ApiDescription.RelativePath, "users/me/onboarding", StringComparison.OrdinalIgnoreCase);

        if (!isTargetEndpoint)
        {
            return;
        }

        var requestBody = operation.RequestBody;
        if (requestBody?.Content is null)
        {
            return;
        }

        if (!requestBody.Content.TryGetValue("application/json", out var mediaType) || mediaType is null)
        {
            return;
        }

        mediaType.Example = new OpenApiObject
        {
            ["userName"] = new OpenApiString("john_doe"),
            ["phoneNumber"] = new OpenApiString("+15551234567"),
            ["country"] = new OpenApiString("Ukraine"),
            ["city"] = new OpenApiString("Kyiv"),
            ["socialNetwork"] = new OpenApiString("@johndoe"),
            ["notificationChannelPreference"] = new OpenApiInteger(0),
            ["petName"] = new OpenApiString("Milo"),
            ["petType"] = new OpenApiInteger(0),
            ["petSex"] = new OpenApiInteger(1),
            ["petSize"] = new OpenApiInteger(1),
            ["petAgeCategory"] = new OpenApiInteger(2),
            ["breed"] = new OpenApiString("Mixed"),
            ["chipNumber"] = new OpenApiString("985112003456789"),
            ["description"] = new OpenApiString("Friendly, wears a blue collar"),
            ["petPhotoUrl"] = new OpenApiString("https://example.com/pet.jpg")
        };
    }
}

