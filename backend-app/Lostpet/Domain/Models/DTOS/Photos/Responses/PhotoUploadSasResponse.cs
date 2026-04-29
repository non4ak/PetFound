namespace Domain.Models.DTOS.Photos.Responses;

public class PhotoUploadSasResponse
{
    public required string UploadUrl { get; init; }

    public required string BlobUrl { get; init; }

    public required string BlobName { get; init; }

    public required DateTimeOffset ExpiresOn { get; init; }

    public required IReadOnlyDictionary<string, string> RequiredHeaders { get; init; }
}
