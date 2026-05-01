using Domain.Models.DTOS.Meta.Responses;
using Infrastructure.Common.ResultPattern;

namespace Application.Meta.Interfaces;

public interface IEnumMetadataService
{
    Task<Result<EnumsResponse>> GetAllAsync();
}

