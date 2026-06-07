using Application.Pets.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.Auth;
using Domain.Models.DTOS.Pets.Models;
using Domain.Models.DTOS.Pets.Responses;
using Domain.Models.Enums;
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
  ***REMOVED***

    public async Task<Result<PetResponse>> CreateAsync(int userId, CreatePetModel model)
    {
        if (!await UserExistsAsync(userId))
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
      ***REMOVED***);
  ***REMOVED***

    public async Task<Result<IEnumerable<PetResponse>>> GetAllByUserAsync(int userId)
    {
        if (!await UserExistsAsync(userId))
        {
            return Result<IEnumerable<PetResponse>>.Failure(UserErrors.UserNotFoundError());
      ***REMOVED***

        var petEntities = await _context.Pets
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedOn)
            .ToListAsync();

        var pets = petEntities.Select(MapPetResponse)
            .ToList();

        return Result<IEnumerable<PetResponse>>.Success(pets);
  ***REMOVED***

    public async Task<Result<PetResponse>> GetByIdAsync(int userId, int petId)
    {
        if (!await UserExistsAsync(userId))
        {
            return Result<PetResponse>.Failure(UserErrors.UserNotFoundError());
      ***REMOVED***

        var pet = await _context.Pets
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == petId && p.UserId == userId);

        if (pet is null)
        {
            return Result<PetResponse>.Failure(Error.NotFound("Pet.NotFound", "Pet not found"));
      ***REMOVED***

        return Result<PetResponse>.Success(MapPetResponse(pet));
  ***REMOVED***

    public async Task<Result<bool>> UpdateAsync(int userId, int petId, UpdatePetModel model)
    {
        if (!await UserExistsAsync(userId))
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
      ***REMOVED***

        var pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == petId && p.UserId == userId);
        if (pet is null)
        {
            return Result<bool>.Failure(Error.NotFound("Pet.NotFound", "Pet not found"));
      ***REMOVED***

        if (string.IsNullOrWhiteSpace(model.PetName))
        {
            return Result<bool>.Failure(UserErrors.RequiredField("petName"));
      ***REMOVED***

        pet.PetName = model.PetName.Trim();
        pet.PetType = model.PetType ?? default;
        pet.PetSex = model.PetSex ?? default;
        pet.PetSize = model.PetSize ?? default;
        pet.PetAgeCategory = model.PetAgeCategory ?? default;
        pet.Breed = string.IsNullOrWhiteSpace(model.Breed) ? null : model.Breed.Trim();
        pet.ChipNumber = string.IsNullOrWhiteSpace(model.ChipNumber) ? null : model.ChipNumber.Trim();
        pet.Description = string.IsNullOrWhiteSpace(model.Description) ? null : model.Description.Trim();

        var newPhotoUrl = string.IsNullOrWhiteSpace(model.PetPhotoUrl) ? null : model.PetPhotoUrl.Trim();
        var photoChanged = pet.PetPhotoUrl != newPhotoUrl;
        pet.PetPhotoUrl = newPhotoUrl;
        pet.LastModifiedOn = DateTimeOffset.UtcNow;

        if (photoChanged && newPhotoUrl is not null)
        {
            // Photo changed - re-vectorize and re-match this pet's active announcements.
            var related = await _context.Announcements
                .Where(a => a.PetId == pet.Id && a.IsActive)
                .ToListAsync();

            foreach (var announcement in related)
            {
                announcement.ProcessingStatus = AnnouncementProcessingStatus.Pending;
                announcement.Vector = null;
                announcement.ProcessingRetryCount = 0;
                announcement.VectorizedOn = null;
                announcement.LastModifiedOn = DateTimeOffset.UtcNow;
          ***REMOVED***
      ***REMOVED***

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
  ***REMOVED***

    public async Task<Result<bool>> DeleteAsync(int userId, int petId)
    {
        if (!await UserExistsAsync(userId))
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
      ***REMOVED***

        var pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == petId && p.UserId == userId);
        if (pet is null)
        {
            return Result<bool>.Failure(Error.NotFound("Pet.NotFound", "Pet not found"));
      ***REMOVED***

        _context.Pets.Remove(pet);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
  ***REMOVED***

    private Task<bool> UserExistsAsync(int userId)
    {
        return _userManager.Users.AnyAsync(u => u.Id == userId);
  ***REMOVED***

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
      ***REMOVED***;
  ***REMOVED***
}

