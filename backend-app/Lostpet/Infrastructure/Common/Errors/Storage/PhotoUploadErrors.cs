namespace Infrastructure.Common.Errors.Storage;

public static class PhotoUploadErrors
{
    public static Error RequiredField(string fieldName)
    {
        return Error.Validation("PhotoUpload.Validation.RequiredField", $"{fieldName} is required");
  ***REMOVED***

    public static Error InvalidFileName()
    {
        return Error.Validation("PhotoUpload.Validation.FileName", "fileName must include a valid image extension");
  ***REMOVED***

    public static Error InvalidContentType(string contentType)
    {
        return Error.Validation("PhotoUpload.Validation.ContentType", $"contentType is not allowed: {contentType}");
  ***REMOVED***

    public static Error InvalidFileSize(long fileSizeInBytes, long maxFileSizeInBytes)
    {
        return Error.Validation(
            "PhotoUpload.Validation.FileSize",
            $"fileSizeInBytes must be greater than 0 and less than or equal to {maxFileSizeInBytes}. Provided value: {fileSizeInBytes}");
  ***REMOVED***

    public static Error StorageConfigurationError(string description)
    {
        return Error.InternalServerError("PhotoUpload.Storage.Configuration", description);
  ***REMOVED***

    public static Error StorageUnavailable(string description)
    {
        return Error.InternalServerError("PhotoUpload.Storage.Unavailable", description);
  ***REMOVED***
}
