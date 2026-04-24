using Application.Announcements.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.DTOS.Announcements.Models;
using Domain.Models.DTOS.Announcements.Responses;
using Domain.Models.Enums;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Announcements.Services;

public class AnnouncementService : IAnnouncementService
{
    private readonly ApplicationDbContext _context;

    public AnnouncementService(ApplicationDbContext context)
    {
        _context = context;
  ***REMOVED***

    public async Task<Result<AnnouncementResponse>> CreateAsync(int userId, CreateAnnouncementModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Country))
            return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("country"));
        if (string.IsNullOrWhiteSpace(model.City))
            return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("city"));
        if (!model.LastDateWhenSeen.HasValue)
            return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("lastDateWhenSeen"));
        if (string.IsNullOrWhiteSpace(model.ApproximateTime))
            return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("approximateTime"));
        if (string.IsNullOrWhiteSpace(model.PetDetails))
            return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("petDetails"));
        if (string.IsNullOrWhiteSpace(model.NearLandmark))
            return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("nearLandmark"));

        var petId = model.PetId;
        if (petId.HasValue)
        {
            var existingPet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == petId.Value);
            if (existingPet is null)
            {
                return Result<AnnouncementResponse>.Failure(Error.NotFound("Pet.NotFound", "Pet not found"));
          ***REMOVED***

            if (model.PetStatus == AnnouncementPetStatus.Lost && existingPet.UserId != userId)
            {
                return Result<AnnouncementResponse>.Failure(Error.Forbidden("Pet.Forbidden", "Lost announcement requires your own pet"));
          ***REMOVED***
      ***REMOVED***
        else
        {
            if (string.IsNullOrWhiteSpace(model.PetName))
            {
                return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("petName"));
          ***REMOVED***

            var nowForPet = DateTimeOffset.UtcNow;
            var generatedPet = new Pet
            {
                UserId = model.PetStatus == AnnouncementPetStatus.Lost ? userId : null,
                PetName = model.PetName.Trim(),
                PetType = model.PetType ?? default,
                PetSex = model.PetSex ?? default,
                PetSize = model.PetSize ?? default,
                PetAgeCategory = model.PetAgeCategory ?? default,
                Breed = string.IsNullOrWhiteSpace(model.Breed) ? null : model.Breed.Trim(),
                ChipNumber = string.IsNullOrWhiteSpace(model.ChipNumber) ? null : model.ChipNumber.Trim(),
                PetPhotoUrl = string.IsNullOrWhiteSpace(model.PetPhotoUrl) ? null : model.PetPhotoUrl.Trim(),
                CreatedOn = nowForPet,
                LastModifiedOn = nowForPet
          ***REMOVED***;

            await _context.Pets.AddAsync(generatedPet);
            await _context.SaveChangesAsync();
            petId = generatedPet.Id;
      ***REMOVED***

        var now = DateTimeOffset.UtcNow;
        var announcement = new Announcement
        {
            PetId = petId.Value,
            ReporterUserId = userId,
            PetStatus = model.PetStatus,
            Country = model.Country.Trim(),
            City = model.City.Trim(),
            LastDateWhenSeen = model.LastDateWhenSeen,
            ApproximateTime = model.ApproximateTime.Trim(),
            PetDetails = model.PetDetails.Trim(),
            IsPhonePublic = model.IsPhonePublic,
            IsTelegramActive = model.IsTelegramActive,
            NearLandmark = model.NearLandmark.Trim(),
            LastSeenLatitude = model.LastSeenLatitude,
            LastSeenLongitude = model.LastSeenLongitude,
            IsActive = true,
            CreatedOn = now,
            LastModifiedOn = now
      ***REMOVED***;

        await _context.Announcements.AddAsync(announcement);
        await _context.SaveChangesAsync();

        return Result<AnnouncementResponse>.Success(new AnnouncementResponse
        {
            Id = announcement.Id,
            PetId = announcement.PetId,
            PetStatus = announcement.PetStatus,
            PetStatusLabel = announcement.PetStatus.GetDisplayName(),
            Country = announcement.Country,
            City = announcement.City,
            LastDateWhenSeen = announcement.LastDateWhenSeen,
            ApproximateTime = announcement.ApproximateTime,
            PetDetails = announcement.PetDetails,
            IsPhonePublic = announcement.IsPhonePublic,
            IsTelegramActive = announcement.IsTelegramActive,
            NearLandmark = announcement.NearLandmark,
            LastSeenLatitude = announcement.LastSeenLatitude,
            LastSeenLongitude = announcement.LastSeenLongitude,
            IsActive = announcement.IsActive,
            CreatedOn = announcement.CreatedOn
      ***REMOVED***);
  ***REMOVED***

    public async Task<Result<IPagedList<AnnouncementResponse>>> GetPagedAsync(int pageNumber, int pageSize)
    {
        var query = _context.Announcements
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedOn)
            .ThenByDescending(a => a.Id);

        var pagedEntities = await PagedList<Announcement>.CreateAsync(query, pageNumber, pageSize);
        var items = pagedEntities.Items.Select(a => new AnnouncementResponse
        {
            Id = a.Id,
            PetId = a.PetId,
            PetStatus = a.PetStatus,
            PetStatusLabel = a.PetStatus.GetDisplayName(),
            Country = a.Country,
            City = a.City,
            LastDateWhenSeen = a.LastDateWhenSeen,
            ApproximateTime = a.ApproximateTime,
            PetDetails = a.PetDetails,
            IsPhonePublic = a.IsPhonePublic,
            IsTelegramActive = a.IsTelegramActive,
            NearLandmark = a.NearLandmark,
            LastSeenLatitude = a.LastSeenLatitude,
            LastSeenLongitude = a.LastSeenLongitude,
            IsActive = a.IsActive,
            CreatedOn = a.CreatedOn
      ***REMOVED***);

        IPagedList<AnnouncementResponse> paged = new PagedList<AnnouncementResponse>(
            currentPage: items,
            count: pagedEntities.TotalCount,
            pageNumber: pagedEntities.CurrentPage,
            pageSize: pagedEntities.PageSize
        )
        {
            TotalPages = pagedEntities.TotalPages
      ***REMOVED***;

        return Result<IPagedList<AnnouncementResponse>>.Success(paged);
  ***REMOVED***

    public async Task<Result<AnnouncementDetailsResponse>> GetByIdAsync(int id)
    {
        var announcement = await _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (announcement is null)
        {
            return Result<AnnouncementDetailsResponse>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
      ***REMOVED***

        return Result<AnnouncementDetailsResponse>.Success(new AnnouncementDetailsResponse
        {
            Id = announcement.Id,
            PetId = announcement.PetId,
            PetStatus = announcement.PetStatus,
            PetStatusLabel = announcement.PetStatus.GetDisplayName(),
            Country = announcement.Country,
            City = announcement.City,
            LastDateWhenSeen = announcement.LastDateWhenSeen,
            ApproximateTime = announcement.ApproximateTime,
            PetDetails = announcement.PetDetails,
            IsPhonePublic = announcement.IsPhonePublic,
            IsTelegramActive = announcement.IsTelegramActive,
            NearLandmark = announcement.NearLandmark,
            LastSeenLatitude = announcement.LastSeenLatitude,
            LastSeenLongitude = announcement.LastSeenLongitude,
            IsActive = announcement.IsActive,
            CreatedOn = announcement.CreatedOn,
            Pet = new AnnouncementPetInfoResponse
            {
                Id = announcement.Pet.Id,
                PetName = announcement.Pet.PetName,
                PetType = announcement.Pet.PetType,
                PetTypeLabel = announcement.Pet.PetType.GetDisplayName(),
                PetSex = announcement.Pet.PetSex,
                PetSexLabel = announcement.Pet.PetSex.GetDisplayName(),
                PetSize = announcement.Pet.PetSize,
                PetSizeLabel = announcement.Pet.PetSize.GetDisplayName(),
                PetAgeCategory = announcement.Pet.PetAgeCategory,
                PetAgeCategoryLabel = announcement.Pet.PetAgeCategory.GetDisplayName(),
                Breed = announcement.Pet.Breed,
                ChipNumber = announcement.Pet.ChipNumber,
                Description = announcement.Pet.Description,
                PetPhotoUrl = announcement.Pet.PetPhotoUrl
          ***REMOVED***
      ***REMOVED***);
  ***REMOVED***
}

