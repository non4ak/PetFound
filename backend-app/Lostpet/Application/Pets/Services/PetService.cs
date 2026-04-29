using Application.Pets.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.Auth;
using Domain.Models.DTOS.Pets.Models;
using Domain.Models.DTOS.Pets.Responses;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Pets.Services;

public class PetService : IPetService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public PetService(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    public async Task<Result<PetResponse>> CreateAsync(int userId, CreatePetModel model)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return Result<PetResponse>.Failure(UserErrors.UserNotFoundError());
        }

        if (string.IsNullOrWhiteSpace(model.PetName))
            return Result<PetResponse>.Failure(UserErrors.RequiredField("petName"));

        var now = DateTimeOffset.UtcNow;
        var pet = new Pet
        {
            UserId = userId,
            PetName = model.PetName.Trim(),
            PetType = model.PetType ?? default,
            PetSex = model.PetSex ?? default,
            PetSize = model.PetSize ?? default,
            PetAgeCategory = model.PetAgeCategory ?? default,
            Breed = string.IsNullOrWhiteSpace(model.Breed) ? null : model.Breed.Trim(),
            ChipNumber = string.IsNullOrWhiteSpace(model.ChipNumber) ? null : model.ChipNumber.Trim(),
            Description = string.IsNullOrWhiteSpace(model.Description) ? null : model.Description.Trim(),
            PetPhotoUrl = string.IsNullOrWhiteSpace(model.PetPhotoUrl) ? null : model.PetPhotoUrl.Trim(),
            CreatedOn = now,
            LastModifiedOn = now
        };

        await _context.Pets.AddAsync(pet);
        await _context.SaveChangesAsync();

        return Result<PetResponse>.Success(new PetResponse
        {
            Id = pet.Id,
            PetName = pet.PetName,
            PetType = pet.PetType,
            PetTypeLabel = pet.PetType.GetDisplayName(),
            PetSex = pet.PetSex,
            PetSexLabel = pet.PetSex.GetDisplayName(),
            PetSize = pet.PetSize,
            PetSizeLabel = pet.PetSize.GetDisplayName(),
            PetAgeCategory = pet.PetAgeCategory,
            PetAgeCategoryLabel = pet.PetAgeCategory.GetDisplayName(),
            Breed = pet.Breed,
            ChipNumber = pet.ChipNumber,
            Description = pet.Description,
            PetPhotoUrl = pet.PetPhotoUrl,
            CreatedOn = pet.CreatedOn
        });
    }

    public async Task<Result<IEnumerable<PetResponse>>> GetAllByUserAsync(int userId)
    {
        var userExists = await _userManager.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Result<IEnumerable<PetResponse>>.Failure(UserErrors.UserNotFoundError());
        }

        var petEntities = await _context.Pets
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedOn)
            .ToListAsync();

        var pets = petEntities.Select(MapPetResponse)
            .ToList();

        return Result<IEnumerable<PetResponse>>.Success(pets);
    }

    public async Task<Result<PetResponse>> GetByIdAsync(int userId, int petId)
    {
        var userExists = await _userManager.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Result<PetResponse>.Failure(UserErrors.UserNotFoundError());
        }

        var pet = await _context.Pets
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == petId && p.UserId == userId);

        if (pet is null)
        {
            return Result<PetResponse>.Failure(Error.NotFound("Pet.NotFound", "Pet not found"));
        }

        return Result<PetResponse>.Success(MapPetResponse(pet));
    }

    private static PetResponse MapPetResponse(Pet p)
    {
        return new PetResponse
        {
            Id = p.Id,
            PetName = p.PetName,
            PetType = p.PetType,
            PetTypeLabel = p.PetType.GetDisplayName(),
            PetSex = p.PetSex,
            PetSexLabel = p.PetSex.GetDisplayName(),
            PetSize = p.PetSize,
            PetSizeLabel = p.PetSize.GetDisplayName(),
            PetAgeCategory = p.PetAgeCategory,
            PetAgeCategoryLabel = p.PetAgeCategory.GetDisplayName(),
            Breed = p.Breed,
            ChipNumber = p.ChipNumber,
            Description = p.Description,
            PetPhotoUrl = p.PetPhotoUrl,
            CreatedOn = p.CreatedOn
        };
    }
}

