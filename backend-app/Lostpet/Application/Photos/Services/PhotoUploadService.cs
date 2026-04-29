using Application.Photos.Interfaces;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Domain.Models.DTOS.Photos.Models;
using Domain.Models.DTOS.Photos.Responses;
using Infrastructure.Common.Errors.Storage;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Common.Storage;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Application.Photos.Services;

public class PhotoUploadService : IPhotoUploadService
{
    private const int StorageMaxAttempts = 3;
    private const string BlockBlobHeaderName = "x-ms-blob-type";
    private const string BlockBlobHeaderValue = "BlockBlob";

    private readonly AzureBlobStorageConfig _config;
    private readonly ILogger<PhotoUploadService> _logger;
    private readonly IReadOnlySet<string> _allowedContentTypes;

    public PhotoUploadService(
        IOptions<AzureBlobStorageConfig> config,
        ILogger<PhotoUploadService> logger)
    {
        _config = config.Value;
        _logger = logger;
        _allowedContentTypes = _config.AllowedContentTypes
            .Select(contentType => contentType.Trim())
            .Where(contentType => !string.IsNullOrWhiteSpace(contentType))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    public async Task<Result<PhotoUploadSasResponse>> CreateUploadSasAsync(int userId, CreatePhotoUploadSasModel model)
    {
        Result<ValidatedPhotoUploadRequest> validationResult = ValidateRequest(model);
        if (!validationResult.IsSuccess)
        {
            return Result<PhotoUploadSasResponse>.Failure(validationResult.Error);
        }

        Result validationConfigResult = ValidateStorageConfiguration();
        if (!validationConfigResult.IsSuccess)
        {
            return Result<PhotoUploadSasResponse>.Failure(validationConfigResult.Error);
        }

        ValidatedPhotoUploadRequest request = validationResult.Value;
        string blobName = CreateBlobName(userId, request.FileExtension);
        Result<BlobServiceClient> blobServiceClientResult = CreateBlobServiceClient();
        if (!blobServiceClientResult.IsSuccess)
        {
            return Result<PhotoUploadSasResponse>.Failure(blobServiceClientResult.Error);
        }

        BlobContainerClient containerClient = blobServiceClientResult.Value.GetBlobContainerClient(_config.ContainerName);
        BlobClient blobClient = containerClient.GetBlobClient(blobName);

        Result containerResult = await EnsureContainerExistsAsync(containerClient);
        if (!containerResult.IsSuccess)
        {
            return Result<PhotoUploadSasResponse>.Failure(containerResult.Error);
        }

        if (!blobClient.CanGenerateSasUri)
        {
            return Result<PhotoUploadSasResponse>.Failure(PhotoUploadErrors.StorageConfigurationError(
                "Azure blob client cannot generate SAS URI. Configure AzureBlobStorage:ConnectionString with an account key."));
        }

        DateTimeOffset expiresOn = DateTimeOffset.UtcNow.AddMinutes(_config.SasLifetimeInMinutes);
        BlobSasBuilder sasBuilder = new BlobSasBuilder(BlobSasPermissions.Create | BlobSasPermissions.Write, expiresOn)
        {
            BlobContainerName = _config.ContainerName,
            BlobName = blobName,
            Resource = "b",
            ContentType = request.ContentType
        };

        Uri uploadUri = blobClient.GenerateSasUri(sasBuilder);
        IReadOnlyDictionary<string, string> requiredHeaders = new Dictionary<string, string>
        {
            [BlockBlobHeaderName] = BlockBlobHeaderValue,
            ["Content-Type"] = request.ContentType
        };

        PhotoUploadSasResponse response = new PhotoUploadSasResponse
        {
            UploadUrl = uploadUri.ToString(),
            BlobUrl = blobClient.Uri.ToString(),
            BlobName = blobName,
            ExpiresOn = expiresOn,
            RequiredHeaders = requiredHeaders
        };

        return Result<PhotoUploadSasResponse>.Success(response);
    }

    private Result<ValidatedPhotoUploadRequest> ValidateRequest(CreatePhotoUploadSasModel model)
    {
        if (string.IsNullOrWhiteSpace(model.FileName))
        {
            return Result<ValidatedPhotoUploadRequest>.Failure(PhotoUploadErrors.RequiredField("fileName"));
        }

        if (string.IsNullOrWhiteSpace(model.ContentType))
        {
            return Result<ValidatedPhotoUploadRequest>.Failure(PhotoUploadErrors.RequiredField("contentType"));
        }

        if (!model.FileSizeInBytes.HasValue)
        {
            return Result<ValidatedPhotoUploadRequest>.Failure(PhotoUploadErrors.RequiredField("fileSizeInBytes"));
        }

        string contentType = model.ContentType.Trim();
        if (!_allowedContentTypes.Contains(contentType))
        {
            return Result<ValidatedPhotoUploadRequest>.Failure(PhotoUploadErrors.InvalidContentType(contentType));
        }

        long fileSizeInBytes = model.FileSizeInBytes.Value;
        if (fileSizeInBytes <= 0 || fileSizeInBytes > _config.MaxFileSizeInBytes)
        {
            return Result<ValidatedPhotoUploadRequest>.Failure(
                PhotoUploadErrors.InvalidFileSize(fileSizeInBytes, _config.MaxFileSizeInBytes));
        }

        string fileExtension = Path.GetExtension(model.FileName.Trim()).ToLowerInvariant();
        if (!IsAllowedExtension(fileExtension, contentType))
        {
            return Result<ValidatedPhotoUploadRequest>.Failure(PhotoUploadErrors.InvalidFileName());
        }

        ValidatedPhotoUploadRequest request = new ValidatedPhotoUploadRequest(
            ContentType: contentType,
            FileExtension: fileExtension,
            FileSizeInBytes: fileSizeInBytes);

        return Result<ValidatedPhotoUploadRequest>.Success(request);
    }

    private Result ValidateStorageConfiguration()
    {
        if (string.IsNullOrWhiteSpace(_config.ConnectionString))
        {
            return Result.Failure(PhotoUploadErrors.StorageConfigurationError("AzureBlobStorage:ConnectionString is missing."));
        }

        if (string.IsNullOrWhiteSpace(_config.ContainerName))
        {
            return Result.Failure(PhotoUploadErrors.StorageConfigurationError("AzureBlobStorage:ContainerName is missing."));
        }

        if (_config.SasLifetimeInMinutes <= 0)
        {
            return Result.Failure(PhotoUploadErrors.StorageConfigurationError("AzureBlobStorage:SasLifetimeInMinutes must be greater than 0."));
        }

        if (_config.MaxFileSizeInBytes <= 0)
        {
            return Result.Failure(PhotoUploadErrors.StorageConfigurationError("AzureBlobStorage:MaxFileSizeInBytes must be greater than 0."));
        }

        if (_allowedContentTypes.Count == 0)
        {
            return Result.Failure(PhotoUploadErrors.StorageConfigurationError("AzureBlobStorage:AllowedContentTypes must contain at least one content type."));
        }

        return Result.Success();
    }

    private Result<BlobServiceClient> CreateBlobServiceClient()
    {
        try
        {
            BlobServiceClient blobServiceClient = new BlobServiceClient(_config.ConnectionString);
            return Result<BlobServiceClient>.Success(blobServiceClient);
        }
        catch (ArgumentException ex)
        {
            return Result<BlobServiceClient>.Failure(PhotoUploadErrors.StorageConfigurationError(
                $"AzureBlobStorage:ConnectionString is invalid. Message: {ex.Message}"));
        }
        catch (FormatException ex)
        {
            return Result<BlobServiceClient>.Failure(PhotoUploadErrors.StorageConfigurationError(
                $"AzureBlobStorage:ConnectionString is invalid. Message: {ex.Message}"));
        }
    }

    private async Task<Result> EnsureContainerExistsAsync(BlobContainerClient containerClient)
    {
        try
        {
            await ExecuteStorageOperationAsync(
                operationName: "CreateIfNotExists",
                operation: () => containerClient.CreateIfNotExistsAsync());

            return Result.Success();
        }
        catch (RequestFailedException ex)
        {
            string description = $"Azure Blob Storage request failed. Status: {ex.Status}. ErrorCode: {ex.ErrorCode}. Message: {ex.Message}";
            return Result.Failure(PhotoUploadErrors.StorageUnavailable(description));
        }
    }

    private async Task ExecuteStorageOperationAsync(string operationName, Func<Task<Response<BlobContainerInfo>>> operation)
    {
        RequestFailedException? lastError = null;

        for (int attempt = 1; attempt <= StorageMaxAttempts; attempt++)
        {
            try
            {
                await operation();
                return;
            }
            catch (RequestFailedException ex) when (attempt < StorageMaxAttempts)
            {
                lastError = ex;
                _logger.LogWarning(
                    ex,
                    "Azure blob storage operation failed before retry. OperationName: {OperationName}. Attempt: {Attempt}. MaxAttempts: {MaxAttempts}. Status: {Status}. ErrorCode: {ErrorCode}. ContainerName: {ContainerName}",
                    operationName,
                    attempt,
                    StorageMaxAttempts,
                    ex.Status,
                    ex.ErrorCode,
                    _config.ContainerName);
            }
        }

        if (lastError is not null)
        {
            throw lastError;
        }
    }

    private static bool IsAllowedExtension(string fileExtension, string contentType)
    {
        return contentType switch
        {
            "image/jpeg" => fileExtension is ".jpg" or ".jpeg",
            "image/png" => fileExtension == ".png",
            "image/webp" => fileExtension == ".webp",
            _ => false
        };
    }

    private static string CreateBlobName(int userId, string fileExtension)
    {
        string datePath = DateTimeOffset.UtcNow.ToString("yyyy/MM/dd");
        string uniqueName = $"{Guid.NewGuid():N}{fileExtension}";
        return $"users/{userId}/photos/{datePath}/{uniqueName}";
    }

    private sealed record ValidatedPhotoUploadRequest(
        string ContentType,
        string FileExtension,
        long FileSizeInBytes);
}
