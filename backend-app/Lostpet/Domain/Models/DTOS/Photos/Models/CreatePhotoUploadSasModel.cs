namespace Domain.Models.DTOS.Photos.Models;

public class CreatePhotoUploadSasModel
{
    public string? FileName { get; set; }

    public string? ContentType { get; set; }

    public long? FileSizeInBytes { get; set; }
}
