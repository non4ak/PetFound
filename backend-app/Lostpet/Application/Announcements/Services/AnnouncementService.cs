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
    }

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
        PetType petTypeForResponse;
        string? petPhotoUrlForResponse;
        if (petId.HasValue)
        {
            var existingPet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == petId.Value);
            if (existingPet is null)
            {
                return Result<AnnouncementResponse>.Failure(Error.NotFound("Pet.NotFound", "Pet not found"));
            }

            if (model.PetStatus == AnnouncementPetStatus.Lost && existingPet.UserId != userId)
            {
                return Result<AnnouncementResponse>.Failure(Error.Forbidden("Pet.Forbidden", "Lost announcement requires your own pet"));
            }

            petTypeForResponse = existingPet.PetType;
            petPhotoUrlForResponse = existingPet.PetPhotoUrl;
        }
        else
        {
            if (string.IsNullOrWhiteSpace(model.PetName))
            {
                return Result<AnnouncementResponse>.Failure(UserErrors.RequiredField("petName"));
            }

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
            };

            await _context.Pets.AddAsync(generatedPet);
            await _context.SaveChangesAsync();
            petId = generatedPet.Id;
            petTypeForResponse = generatedPet.PetType;
            petPhotoUrlForResponse = generatedPet.PetPhotoUrl;
        }

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
            ProcessingStatus = AnnouncementProcessingStatus.Pending,
            CreatedOn = now,
            LastModifiedOn = now
        };

        await _context.Announcements.AddAsync(announcement);
        await _context.SaveChangesAsync();

        return Result<AnnouncementResponse>.Success(new AnnouncementResponse
        {
            Id = announcement.Id,
            PetId = announcement.PetId,
            PetStatus = announcement.PetStatus,
            PetStatusLabel = announcement.PetStatus.GetDisplayName(),
            PetType = petTypeForResponse,
            PetTypeLabel = petTypeForResponse.GetDisplayName(),
            PetPhotoUrl = petPhotoUrlForResponse,
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
        });
    }

    public Task<Result<IPagedList<AnnouncementResponse>>> GetPagedAsync(int pageNumber, int pageSize, AnnouncementListQueryModel queryModel)
    {
        var query = _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .AsQueryable();

        return BuildPagedAnnouncementsAsync(query, pageNumber, pageSize, queryModel);
    }

    public Task<Result<IPagedList<AnnouncementResponse>>> GetMyPagedAsync(int userId, int pageNumber, int pageSize, AnnouncementListQueryModel queryModel)
    {
        var query = _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .Where(a => a.ReporterUserId == userId)
            .AsQueryable();

        return BuildPagedAnnouncementsAsync(query, pageNumber, pageSize, queryModel);
    }

    private async Task<Result<IPagedList<AnnouncementResponse>>> BuildPagedAnnouncementsAsync(IQueryable<Announcement> query, int pageNumber, int pageSize, AnnouncementListQueryModel queryModel)
    {
        if (!string.IsNullOrWhiteSpace(queryModel.Search))
        {
            var search = queryModel.Search.Trim().ToLower();
            query = query.Where(a =>
                (a.PetDetails != null && a.PetDetails.ToLower().Contains(search)) ||
                (a.NearLandmark != null && a.NearLandmark.ToLower().Contains(search)) ||
                (a.City != null && a.City.ToLower().Contains(search)) ||
                (a.Country != null && a.Country.ToLower().Contains(search)));
        }

        if (queryModel.PetStatus.HasValue)
        {
            query = query.Where(a => a.PetStatus == queryModel.PetStatus.Value);
        }

        if (queryModel.PetType.HasValue)
        {
            query = query.Where(a => a.Pet.PetType == queryModel.PetType.Value);
        }

        if (!string.IsNullOrWhiteSpace(queryModel.Country))
        {
            var country = queryModel.Country.Trim();
            query = query.Where(a => a.Country != null && a.Country.ToLower() == country.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(queryModel.City))
        {
            var city = queryModel.City.Trim();
            query = query.Where(a => a.City != null && a.City.ToLower() == city.ToLower());
        }

        if (queryModel.CreatedFrom.HasValue)
        {
            query = query.Where(a => a.CreatedOn >= queryModel.CreatedFrom.Value);
        }

        if (queryModel.CreatedTo.HasValue)
        {
            query = query.Where(a => a.CreatedOn <= queryModel.CreatedTo.Value);
        }

        if (queryModel.IsActive.HasValue)
        {
            query = query.Where(a => a.IsActive == queryModel.IsActive.Value);
        }

        query = ApplySorting(query, queryModel.SortBy, queryModel.SortDirection);

        var pagedEntities = await PagedList<Announcement>.CreateAsync(query, pageNumber, pageSize);

        var announcementIds = pagedEntities.Items.Select(a => a.Id).ToList();
        var commentCounts = await _context.Comments
            .Where(c => announcementIds.Contains(c.AnnouncementId) && c.ParentCommentId == null && !c.IsDeleted)
            .GroupBy(c => c.AnnouncementId)
            .Select(g => new { AnnouncementId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.AnnouncementId, x => x.Count);

        var items = pagedEntities.Items.Select(a => MapAnnouncementResponse(a, commentCounts.GetValueOrDefault(a.Id, 0)));

        IPagedList<AnnouncementResponse> paged = new PagedList<AnnouncementResponse>(
            currentPage: items,
            count: pagedEntities.TotalCount,
            pageNumber: pagedEntities.CurrentPage,
            pageSize: pagedEntities.PageSize
        )
        {
            TotalPages = pagedEntities.TotalPages
        };

        return Result<IPagedList<AnnouncementResponse>>.Success(paged);
    }

    public async Task<Result<AnnouncementDetailsResponse>> GetByIdAsync(int id)
    {
        var announcement = await _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .Include(a => a.ReporterUser)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (announcement is null)
        {
            return Result<AnnouncementDetailsResponse>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
        }

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
            PhoneNumber = announcement.IsPhonePublic
                ? announcement.ReporterUser.PhoneNumber
                : null,
            SocialNetwork = announcement.IsTelegramActive
                ? announcement.ReporterUser.SocialNetwork
                : null,
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
            }
        });
    }

    public async Task<Result<bool>> UpdateAsync(int userId, int id, UpdateAnnouncementModel model)
    {
        var announcement = await _context.Announcements
            .Include(a => a.Pet)
            .FirstOrDefaultAsync(a => a.Id == id && a.ReporterUserId == userId);

        if (announcement is null)
        {
            return Result<bool>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
        }

        if (string.IsNullOrWhiteSpace(model.Country))
            return Result<bool>.Failure(UserErrors.RequiredField("country"));
        if (string.IsNullOrWhiteSpace(model.City))
            return Result<bool>.Failure(UserErrors.RequiredField("city"));
        if (!model.LastDateWhenSeen.HasValue)
            return Result<bool>.Failure(UserErrors.RequiredField("lastDateWhenSeen"));
        if (string.IsNullOrWhiteSpace(model.ApproximateTime))
            return Result<bool>.Failure(UserErrors.RequiredField("approximateTime"));
        if (string.IsNullOrWhiteSpace(model.PetDetails))
            return Result<bool>.Failure(UserErrors.RequiredField("petDetails"));
        if (string.IsNullOrWhiteSpace(model.NearLandmark))
            return Result<bool>.Failure(UserErrors.RequiredField("nearLandmark"));

        announcement.Country = model.Country.Trim();
        announcement.City = model.City.Trim();
        announcement.LastDateWhenSeen = model.LastDateWhenSeen;
        announcement.ApproximateTime = model.ApproximateTime.Trim();
        announcement.PetDetails = model.PetDetails.Trim();
        announcement.IsPhonePublic = model.IsPhonePublic;
        announcement.IsTelegramActive = model.IsTelegramActive;
        announcement.NearLandmark = model.NearLandmark.Trim();
        announcement.LastSeenLatitude = model.LastSeenLatitude;
        announcement.LastSeenLongitude = model.LastSeenLongitude;
        announcement.PetStatus = model.PetStatus;
        announcement.LastModifiedOn = DateTimeOffset.UtcNow;

        // Keep pet ownership rules aligned when status changes.
        if (announcement.PetStatus == AnnouncementPetStatus.Lost)
        {
            announcement.Pet.UserId = userId;
        }
        else
        {
            announcement.Pet.UserId = null;
        }

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> ArchiveAsync(int userId, int id)
    {
        var announcement = await _context.Announcements
            .FirstOrDefaultAsync(a => a.Id == id && a.ReporterUserId == userId);

        if (announcement is null)
        {
            return Result<bool>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
        }

        announcement.IsActive = false;
        announcement.LastModifiedOn = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RestoreAsync(int userId, int id)
    {
        var announcement = await _context.Announcements
            .FirstOrDefaultAsync(a => a.Id == id && a.ReporterUserId == userId);

        if (announcement is null)
        {
            return Result<bool>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
        }

        announcement.IsActive = true;
        announcement.LastModifiedOn = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    private static IOrderedQueryable<Announcement> ApplySorting(IQueryable<Announcement> query, string? sortBy, string? sortDirection)
    {
        var isAsc = string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase);
        var normalizedSortBy = sortBy?.Trim().ToLowerInvariant();

        return normalizedSortBy switch
        {
            "lastdatewhenseen" => isAsc
                ? query.OrderBy(a => a.LastDateWhenSeen).ThenBy(a => a.Id)
                : query.OrderByDescending(a => a.LastDateWhenSeen).ThenByDescending(a => a.Id),
            _ => isAsc
                ? query.OrderBy(a => a.CreatedOn).ThenBy(a => a.Id)
                : query.OrderByDescending(a => a.CreatedOn).ThenByDescending(a => a.Id)
        };
    }

    private static AnnouncementResponse MapAnnouncementResponse(Announcement a, int commentsCount = 0)
    {
        return new AnnouncementResponse
        {
            Id = a.Id,
            PetId = a.PetId,
            PetStatus = a.PetStatus,
            PetStatusLabel = a.PetStatus.GetDisplayName(),
            PetName = a.Pet.PetName,
            PetType = a.Pet.PetType,
            PetTypeLabel = a.Pet.PetType.GetDisplayName(),
            Breed = a.Pet.Breed,
            PetSex = a.Pet.PetSex,
            PetSexLabel = a.Pet.PetSex.GetDisplayName(),
            PetSize = a.Pet.PetSize,
            PetSizeLabel = a.Pet.PetSize.GetDisplayName(),
            PetPhotoUrl = a.Pet.PetPhotoUrl,
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
            CreatedOn = a.CreatedOn,
            CommentsCount = commentsCount
        };
    }
}

