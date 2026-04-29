using Domain.Models.DTOS.Photos.Models;
using Domain.Models.DTOS.Photos.Responses;
using Infrastructure.Common.ResultPattern;

namespace Application.Photos.Interfaces;

public interface IPhotoUploadService
{
    Task<Result<PhotoUploadSasResponse>> CreateUploadSasAsync(int userId, CreatePhotoUploadSasModel model);
}
