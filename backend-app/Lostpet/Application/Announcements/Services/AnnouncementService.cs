using Application.Announcements.Interfaces;
using Domain.Models;
using Domain.Models.DTOS.Announcements.Models;
using Domain.Models.DTOS.Announcements.Responses;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.User;
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

    public async Task<Result<AnnouncementResponse>> CreateAsync(int userId, int petId, CreateAnnouncementModel model)
    {
        var pet = await _context.Pets.AsNoTracking().FirstOrDefaultAsync(p => p.Id == petId && p.UserId == userId);
        if (pet is null)
        {
            return Result<AnnouncementResponse>.Failure(Error.NotFound("Pet.NotFound", "Pet not found for current user"));
      ***REMOVED***

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

        var now = DateTimeOffset.UtcNow;
        var announcement = new Announcement
        {
            PetId = petId,
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
}

