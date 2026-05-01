namespace Infrastructure.Common.Storage;

public class AzureBlobStorageConfig
{
    public string ConnectionString { get; set; } = string.Empty;

    public string ContainerName { get; set; } = string.Empty;

    public int SasLifetimeInMinutes { get; set; }

    public long MaxFileSizeInBytes { get; set; }

    public string[] AllowedContentTypes { get; set; } = [];
}
