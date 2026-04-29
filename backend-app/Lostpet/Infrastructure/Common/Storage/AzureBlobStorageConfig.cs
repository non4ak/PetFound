namespace Infrastructure.Common.Storage;

public class AzureBlobStorageConfig
{
    public string ConnectionString { get; init; } = string.Empty;

    public string ContainerName { get; init; } = string.Empty;

    public int SasLifetimeInMinutes { get; init; }

    public long MaxFileSizeInBytes { get; init; }

    public string[] AllowedContentTypes { get; init; } = [];
}
