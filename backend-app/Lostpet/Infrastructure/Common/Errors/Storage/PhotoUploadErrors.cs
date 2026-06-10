namespace Infrastructure.Common.Errors.Storage;

public static class PhotoUploadErrors
{
    public static Error RequiredField(string fieldName)
    {
        return Error.Validation("PhotoUpload.Validation.RequiredField", $"{fieldName} is required");
    }

    public static Error InvalidFileName()
    {
        return Error.Validation("PhotoUpload.Validation.FileName", "fileName must include a valid image extension");
    }

    public static Error InvalidContentType(string contentType)
    {
        return Error.Validation("PhotoUpload.Validation.ContentType", $"contentType is not allowed: {contentType}");
    }

    public static Error InvalidFileSize(long fileSizeInBytes, long maxFileSizeInBytes)
    {
        return Error.Validation(
            "PhotoUpload.Validation.FileSize",
            $"fileSizeInBytes must be greater than 0 and less than or equal to {maxFileSizeInBytes}. Provided value: {fileSizeInBytes}");
    }

    public static Error StorageConfigurationError(string description)
    {
        return Error.InternalServerError("PhotoUpload.Storage.Configuration", description);
    }

    public static Error StorageUnavailable(string description)
    {
        return Error.InternalServerError("PhotoUpload.Storage.Unavailable", description);
    }
}
