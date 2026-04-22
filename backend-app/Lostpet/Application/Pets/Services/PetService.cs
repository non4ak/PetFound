using Application.Pets.Interfaces;
using Domain.Models;
using Domain.Models.Auth;
using Domain.Models.DTOS.Pets.Models;
using Domain.Models.DTOS.Pets.Responses;
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
  ***REMOVED***

    public async Task<Result<PetResponse>> CreateAsync(int userId, CreatePetModel model)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return Result<PetResponse>.Failure(UserErrors.UserNotFoundError());
      ***REMOVED***

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
      ***REMOVED***;

        await _context.Pets.AddAsync(pet);
        await _context.SaveChangesAsync();

        return Result<PetResponse>.Success(new PetResponse
        {
            Id = pet.Id,
            PetName = pet.PetName,
            PetType = pet.PetType,
            PetSex = pet.PetSex,
            PetSize = pet.PetSize,
            PetAgeCategory = pet.PetAgeCategory,
            Breed = pet.Breed,
            ChipNumber = pet.ChipNumber,
            Description = pet.Description,
            PetPhotoUrl = pet.PetPhotoUrl,
            CreatedOn = pet.CreatedOn
      ***REMOVED***);
  ***REMOVED***

    public async Task<Result<IEnumerable<PetResponse>>> GetAllByUserAsync(int userId)
    {
        var userExists = await _userManager.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Result<IEnumerable<PetResponse>>.Failure(UserErrors.UserNotFoundError());
      ***REMOVED***

        var pets = await _context.Pets
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedOn)
            .Select(p => new PetResponse
            {
                Id = p.Id,
                PetName = p.PetName,
                PetType = p.PetType,
                PetSex = p.PetSex,
                PetSize = p.PetSize,
                PetAgeCategory = p.PetAgeCategory,
                Breed = p.Breed,
                ChipNumber = p.ChipNumber,
                Description = p.Description,
                PetPhotoUrl = p.PetPhotoUrl,
                CreatedOn = p.CreatedOn
          ***REMOVED***)
            .ToListAsync();

        return Result<IEnumerable<PetResponse>>.Success(pets);
  ***REMOVED***
}

