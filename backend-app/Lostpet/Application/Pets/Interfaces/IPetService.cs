using Domain.Models.DTOS.Pets.Models;
using Domain.Models.DTOS.Pets.Responses;
using Infrastructure.Common.ResultPattern;

namespace Application.Pets.Interfaces;

public interface IPetService
{
    Task<Result<PetResponse>> CreateAsync(int userId, CreatePetModel model);

    Task<Result<IEnumerable<PetResponse>>> GetAllByUserAsync(int userId);

    Task<Result<PetResponse>> GetByIdAsync(int userId, int petId);

    Task<Result<bool>> UpdateAsync(int userId, int petId, UpdatePetModel model);

    Task<Result<bool>> DeleteAsync(int userId, int petId);
}

