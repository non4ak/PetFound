using Application.Onboarding.Interfaces;
using Domain.Models;
using Domain.Models.Auth;
using Domain.Models.DTOS.Onboarding.Models;
using Domain.Models.DTOS.Onboarding.Responses;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Onboarding.Services;

public class OnboardingService : IOnboardingService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public OnboardingService(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    public async Task<Result<OnboardingResponse>> CompleteAsync(int userId, CompleteOnboardingModel model)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return Result<OnboardingResponse>.Failure(UserErrors.UserNotFoundError());
        }

        if (string.IsNullOrWhiteSpace(model.UserName))
            return Result<OnboardingResponse>.Failure(UserErrors.RequiredField("userName"));
        if (string.IsNullOrWhiteSpace(model.PhoneNumber))
            return Result<OnboardingResponse>.Failure(UserErrors.RequiredField("phoneNumber"));
        if (string.IsNullOrWhiteSpace(model.Country))
            return Result<OnboardingResponse>.Failure(UserErrors.RequiredField("country"));
        if (string.IsNullOrWhiteSpace(model.City))
            return Result<OnboardingResponse>.Failure(UserErrors.RequiredField("city"));

        user.UserName = model.UserName.Trim();
        user.PhoneNumber = model.PhoneNumber.Trim();
        user.Country = model.Country.Trim();
        user.City = model.City.Trim();
        user.SocialNetwork = string.IsNullOrWhiteSpace(model.SocialNetwork) ? null : model.SocialNetwork.Trim();

        if (model.NotificationChannelPreference.HasValue)
        {
            user.NotificationChannelPreference = model.NotificationChannelPreference.Value;
        }

        var petDataPresent =
            !string.IsNullOrWhiteSpace(model.PetPhotoUrl) ||
            !string.IsNullOrWhiteSpace(model.PetName) ||
            model.PetType.HasValue ||
            model.PetSex.HasValue ||
            model.PetSize.HasValue ||
            model.PetAgeCategory.HasValue ||
            !string.IsNullOrWhiteSpace(model.Breed) ||
            !string.IsNullOrWhiteSpace(model.ChipNumber) ||
            !string.IsNullOrWhiteSpace(model.Description);

        int? petId = null;
        if (petDataPresent)
        {
            var pet = await _context.Pets
                .Where(p => p.UserId == user.Id)
                .OrderBy(p => p.Id)
                .FirstOrDefaultAsync();

            var now = DateTimeOffset.UtcNow;
            if (pet is null)
            {
                pet = new Pet
                {
                    UserId = user.Id,
                    PetName = string.IsNullOrWhiteSpace(model.PetName) ? "Pet" : model.PetName.Trim(),
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
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(model.PetName)) pet.PetName = model.PetName.Trim();
                if (model.PetType.HasValue) pet.PetType = model.PetType.Value;
                if (model.PetSex.HasValue) pet.PetSex = model.PetSex.Value;
                if (model.PetSize.HasValue) pet.PetSize = model.PetSize.Value;
                if (model.PetAgeCategory.HasValue) pet.PetAgeCategory = model.PetAgeCategory.Value;
                if (model.Breed != null) pet.Breed = string.IsNullOrWhiteSpace(model.Breed) ? null : model.Breed.Trim();
                if (model.ChipNumber != null) pet.ChipNumber = string.IsNullOrWhiteSpace(model.ChipNumber) ? null : model.ChipNumber.Trim();
                if (model.Description != null) pet.Description = string.IsNullOrWhiteSpace(model.Description) ? null : model.Description.Trim();
                if (model.PetPhotoUrl != null) pet.PetPhotoUrl = string.IsNullOrWhiteSpace(model.PetPhotoUrl) ? null : model.PetPhotoUrl.Trim();
                pet.LastModifiedOn = now;
            }

            await _context.SaveChangesAsync();
            petId = pet.Id;
        }

        user.IsOnboardingCompleted = true;
        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return Result<OnboardingResponse>.Failure(UserErrors.UserNotCreatedError(updateResult.Errors.First().Description));
        }

        return Result<OnboardingResponse>.Success(new OnboardingResponse
        {
            UserId = user.Id,
            IsOnboardingCompleted = user.IsOnboardingCompleted,
            PetId = petId
        });
    }
}

