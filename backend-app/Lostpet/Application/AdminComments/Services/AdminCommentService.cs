using Application.AdminComments.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.DTOS.AdminComments.Models;
using Domain.Models.DTOS.AdminComments.Responses;
using Domain.Models.DTOS.Comments.Models;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.AdminComments.Services;

public class AdminCommentService : IAdminCommentService
{
    private const string DeletedPlaceholder = "Comment deleted";

    private readonly ApplicationDbContext _context;

    public AdminCommentService(ApplicationDbContext context)
    {
        _context = context;
  ***REMOVED***

    public async Task<Result<IPagedList<AdminCommentListItemDto>>> ListAsync(
        AdminCommentListQueryModel query,
        int pageNumber,
        int pageSize)
    {
        var q = _context.Comments
            .AsNoTracking()
            .Include(c => c.Author)
            .Include(c => c.Announcement)
            .ThenInclude(a => a.Pet)
            .AsQueryable();

        if (query.AnnouncementId.HasValue)
        {
            q = q.Where(c => c.AnnouncementId == query.AnnouncementId.Value);
      ***REMOVED***

        if (query.IsDeleted.HasValue)
        {
            q = q.Where(c => c.IsDeleted == query.IsDeleted.Value);
      ***REMOVED***

        var isAsc = string.Equals(query.SortDirection, "asc", StringComparison.OrdinalIgnoreCase);
        q = isAsc
            ? q.OrderBy(c => c.CommentedAt).ThenBy(c => c.Id)
            : q.OrderByDescending(c => c.CommentedAt).ThenByDescending(c => c.Id);

        var paged = await PagedList<Comment>.CreateAsync(q, pageNumber, pageSize);

        var items = paged.Items.Select(c => new AdminCommentListItemDto
        {
            Id = c.Id,
            AnnouncementId = c.AnnouncementId,
            ParentCommentId = c.ParentCommentId,
            CommentMessage = c.IsDeleted ? DeletedPlaceholder : c.CommentMessage,
            ImageUrl = c.IsDeleted ? null : c.ImageUrl,
            Latitude = c.Latitude,
            Longitude = c.Longitude,
            LocationDescription = c.LocationDescription,
            CommentedAt = c.CommentedAt,
            LastModifiedOn = c.LastModifiedOn,
            IsDeleted = c.IsDeleted,
            DeletedAt = c.DeletedAt,
            AuthorUserId = c.UserId,
            AuthorUserName = c.Author?.UserName ?? string.Empty,
            AnnouncementPetStatus = c.Announcement.PetStatus,
            AnnouncementPetStatusLabel = c.Announcement.PetStatus.GetDisplayName(),
            AnnouncementCity = c.Announcement.City,
            AnnouncementCountry = c.Announcement.Country
      ***REMOVED***);

        IPagedList<AdminCommentListItemDto> result = new PagedList<AdminCommentListItemDto>(
            currentPage: items,
            count: paged.TotalCount,
            pageNumber: paged.CurrentPage,
            pageSize: paged.PageSize
        )
        {
            TotalPages = paged.TotalPages
      ***REMOVED***;

        return Result<IPagedList<AdminCommentListItemDto>>.Success(result);
  ***REMOVED***

    public async Task<Result<bool>> UpdateAsync(int announcementId, int commentId, UpdateCommentModel model)
    {
        if (string.IsNullOrWhiteSpace(model.CommentMessage))
        {
            return Result<bool>.Failure(UserErrors.RequiredField("commentMessage"));
      ***REMOVED***

        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.AnnouncementId == announcementId);
        if (comment is null)
        {
            return Result<bool>.Failure(Error.NotFound("Comment.NotFound", "Comment not found"));
      ***REMOVED***

        if (comment.IsDeleted)
        {
            return Result<bool>.Failure(Error.Validation("Comment.Deleted", "Cannot edit a deleted comment"));
      ***REMOVED***

        comment.CommentMessage = model.CommentMessage.Trim();
        comment.ImageUrl = string.IsNullOrWhiteSpace(model.ImageUrl) ? null : model.ImageUrl.Trim();
        comment.Latitude = model.Latitude;
        comment.Longitude = model.Longitude;
        comment.LocationDescription = string.IsNullOrWhiteSpace(model.LocationDescription) ? null : model.LocationDescription.Trim();
        comment.LastModifiedOn = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
  ***REMOVED***

    public async Task<Result<bool>> SoftDeleteAsync(int announcementId, int commentId)
    {
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.AnnouncementId == announcementId);
        if (comment is null)
        {
            return Result<bool>.Failure(Error.NotFound("Comment.NotFound", "Comment not found"));
      ***REMOVED***

        if (comment.IsDeleted)
        {
            return Result<bool>.Success(true);
      ***REMOVED***

        var now = DateTimeOffset.UtcNow;
        comment.IsDeleted = true;
        comment.DeletedAt = now;
        comment.LastModifiedOn = now;
        comment.CommentMessage = string.Empty;
        comment.ImageUrl = null;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
  ***REMOVED***
}
