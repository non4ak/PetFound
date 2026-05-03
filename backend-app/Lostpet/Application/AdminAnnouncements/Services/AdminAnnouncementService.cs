using Application.AdminAnnouncements.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.DTOS.AdminAnnouncements.Models;
using Domain.Models.DTOS.AdminAnnouncements.Responses;
using Domain.Models.DTOS.Announcements.Models;
using Domain.Models.DTOS.Announcements.Responses;
using Domain.Models.Enums;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.AdminAnnouncements.Services;

public class AdminAnnouncementService : IAdminAnnouncementService
{
    private readonly ApplicationDbContext _context;

    public AdminAnnouncementService(ApplicationDbContext context)
    {
        _context = context;
  ***REMOVED***

    public async Task<Result<IPagedList<AdminAnnouncementListItemDto>>> ListAsync(
        AdminAnnouncementListQueryModel query,
        int pageNumber,
        int pageSize)
    {
        var q = _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .Include(a => a.ReporterUser)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim().ToLower();
            q = q.Where(a =>
                (a.PetDetails != null && a.PetDetails.ToLower().Contains(s)) ||
                (a.NearLandmark != null && a.NearLandmark.ToLower().Contains(s)) ||
                (a.City != null && a.City.ToLower().Contains(s)) ||
                (a.Country != null && a.Country.ToLower().Contains(s)));
      ***REMOVED***

        if (query.PetStatus.HasValue)
        {
            q = q.Where(a => a.PetStatus == query.PetStatus.Value);
      ***REMOVED***

        if (query.PetType.HasValue)
        {
            q = q.Where(a => a.Pet.PetType == query.PetType.Value);
      ***REMOVED***

        if (!string.IsNullOrWhiteSpace(query.Country))
        {
            var country = query.Country.Trim();
            q = q.Where(a => a.Country != null && a.Country.ToLower() == country.ToLower());
      ***REMOVED***

        if (!string.IsNullOrWhiteSpace(query.City))
        {
            var city = query.City.Trim();
            q = q.Where(a => a.City != null && a.City.ToLower() == city.ToLower());
      ***REMOVED***

        if (query.CreatedFrom.HasValue)
        {
            q = q.Where(a => a.CreatedOn >= query.CreatedFrom.Value);
      ***REMOVED***

        if (query.CreatedTo.HasValue)
        {
            q = q.Where(a => a.CreatedOn <= query.CreatedTo.Value);
      ***REMOVED***

        if (query.IsActive.HasValue)
        {
            q = q.Where(a => a.IsActive == query.IsActive.Value);
      ***REMOVED***

        if (query.ReporterUserId.HasValue)
        {
            q = q.Where(a => a.ReporterUserId == query.ReporterUserId.Value);
      ***REMOVED***

        q = ApplySorting(q, query.SortBy, query.SortDirection);

        var pagedEntities = await PagedList<Announcement>.CreateAsync(q, pageNumber, pageSize);
        var items = pagedEntities.Items.Select(a => new AdminAnnouncementListItemDto
        {
            Id = a.Id,
            PetId = a.PetId,
            PetStatus = a.PetStatus,
            PetStatusLabel = a.PetStatus.GetDisplayName(),
            PetType = a.Pet.PetType,
            PetTypeLabel = a.Pet.PetType.GetDisplayName(),
            Country = a.Country,
            City = a.City,
            IsActive = a.IsActive,
            CreatedOn = a.CreatedOn,
            ReporterUserId = a.ReporterUserId,
            ReporterUserName = a.ReporterUser.UserName,
            ReporterEmail = a.ReporterUser.Email
      ***REMOVED***);

        IPagedList<AdminAnnouncementListItemDto> paged = new PagedList<AdminAnnouncementListItemDto>(
            currentPage: items,
            count: pagedEntities.TotalCount,
            pageNumber: pagedEntities.CurrentPage,
            pageSize: pagedEntities.PageSize
        )
        {
            TotalPages = pagedEntities.TotalPages
      ***REMOVED***;

        return Result<IPagedList<AdminAnnouncementListItemDto>>.Success(paged);
  ***REMOVED***

    public async Task<Result<AdminAnnouncementDetailsDto>> GetByIdAsync(int id)
    {
        var announcement = await _context.Announcements
            .AsNoTracking()
            .Include(a => a.Pet)
            .Include(a => a.ReporterUser)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (announcement is null)
        {
            return Result<AdminAnnouncementDetailsDto>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
      ***REMOVED***

        var commentsCount = await _context.Comments.CountAsync(c => c.AnnouncementId == id);

        var dto = new AdminAnnouncementDetailsDto
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
          ***REMOVED***,
            ReporterUserId = announcement.ReporterUserId,
            ReporterUserName = announcement.ReporterUser.UserName ?? string.Empty,
            ReporterEmail = announcement.ReporterUser.Email,
            CommentsCount = commentsCount
      ***REMOVED***;

        return Result<AdminAnnouncementDetailsDto>.Success(dto);
  ***REMOVED***

    public async Task<Result<bool>> UpdateAsync(int id, UpdateAnnouncementModel model)
    {
        var announcement = await _context.Announcements
            .Include(a => a.Pet)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (announcement is null)
        {
            return Result<bool>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
      ***REMOVED***

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

        var reporterId = announcement.ReporterUserId;
        if (announcement.PetStatus == AnnouncementPetStatus.Lost)
        {
            announcement.Pet.UserId = reporterId;
      ***REMOVED***
        else
        {
            announcement.Pet.UserId = null;
      ***REMOVED***

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
  ***REMOVED***

    public async Task<Result<bool>> ArchiveAsync(int id)
    {
        var announcement = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == id);
        if (announcement is null)
        {
            return Result<bool>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
      ***REMOVED***

        announcement.IsActive = false;
        announcement.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
  ***REMOVED***

    public async Task<Result<bool>> RestoreAsync(int id)
    {
        var announcement = await _context.Announcements.FirstOrDefaultAsync(a => a.Id == id);
        if (announcement is null)
        {
            return Result<bool>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
      ***REMOVED***

        announcement.IsActive = true;
        announcement.LastModifiedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
  ***REMOVED***

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
      ***REMOVED***;
  ***REMOVED***
}
