using Application.Comments.Interfaces;
using Domain.Models;
using Domain.Models.DTOS.Comments.Models;
using Domain.Models.DTOS.Comments.Responses;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Comments.Services;

public class CommentService : ICommentService
{
    private const string DeletedPlaceholder = "Comment deleted";

    private readonly ApplicationDbContext _context;

    public CommentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CommentResponse>> CreateAsync(int userId, int announcementId, CreateCommentModel model)
    {
        if (string.IsNullOrWhiteSpace(model.CommentMessage))
        {
            return Result<CommentResponse>.Failure(UserErrors.RequiredField("commentMessage"));
        }

        var announcementExists = await _context.Announcements.AnyAsync(a => a.Id == announcementId);
        if (!announcementExists)
        {
            return Result<CommentResponse>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
        }

        if (model.ParentCommentId.HasValue)
        {
            var parent = await _context.Comments
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == model.ParentCommentId.Value);

            if (parent is null)
            {
                return Result<CommentResponse>.Failure(Error.NotFound("Comment.ParentNotFound", "Parent comment not found"));
            }

            if (parent.AnnouncementId != announcementId)
            {
                return Result<CommentResponse>.Failure(Error.Validation("Comment.ParentMismatch", "Parent comment belongs to another announcement"));
            }
        }

        var now = DateTimeOffset.UtcNow;
        var comment = new Comment
        {
            AnnouncementId = announcementId,
            UserId = userId,
            ParentCommentId = model.ParentCommentId,
            CommentMessage = model.CommentMessage.Trim(),
            ImageUrl = string.IsNullOrWhiteSpace(model.ImageUrl) ? null : model.ImageUrl.Trim(),
            Latitude = model.Latitude,
            Longitude = model.Longitude,
            LocationDescription = string.IsNullOrWhiteSpace(model.LocationDescription) ? null : model.LocationDescription.Trim(),
            CommentedAt = now,
            CreatedOn = now,
            LastModifiedOn = now,
            IsDeleted = false
        };

        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        await _context.Entry(comment).Reference(c => c.Author).LoadAsync();

        return Result<CommentResponse>.Success(MapComment(comment, includeReplies: false));
    }

    public async Task<Result<IPagedList<CommentResponse>>> GetThreadAsync(int announcementId, int pageNumber, int pageSize)
    {
        var announcementExists = await _context.Announcements.AnyAsync(a => a.Id == announcementId);
        if (!announcementExists)
        {
            return Result<IPagedList<CommentResponse>>.Failure(Error.NotFound("Announcement.NotFound", "Announcement not found"));
        }

        var rootsQuery = _context.Comments
            .AsNoTracking()
            .Include(c => c.Author)
            .Where(c => c.AnnouncementId == announcementId && c.ParentCommentId == null)
            .OrderBy(c => c.CommentedAt)
            .ThenBy(c => c.Id);

        var pagedRoots = await PagedList<Comment>.CreateAsync(rootsQuery, pageNumber, pageSize);
        var rootIds = pagedRoots.Items.Select(c => c.Id).ToList();

        var allDescendants = new List<Comment>();
        if (rootIds.Count > 0)
        {
            var currentLevelIds = rootIds.ToList();
            while (currentLevelIds.Count > 0)
            {
                var nextLevel = await _context.Comments
                    .AsNoTracking()
                    .Include(c => c.Author)
                    .Where(c => c.ParentCommentId != null && currentLevelIds.Contains(c.ParentCommentId!.Value))
                    .OrderBy(c => c.CommentedAt)
                    .ThenBy(c => c.Id)
                    .ToListAsync();

                if (nextLevel.Count == 0)
                {
                    break;
                }

                allDescendants.AddRange(nextLevel);
                currentLevelIds = nextLevel.Select(c => c.Id).ToList();
            }
        }

        var byParent = allDescendants
            .GroupBy(c => c.ParentCommentId!.Value)
            .ToDictionary(g => g.Key, g => g.ToList());

        var items = pagedRoots.Items
            .Select(root => BuildTree(root, byParent))
            .ToList();

        IPagedList<CommentResponse> paged = new PagedList<CommentResponse>(
            currentPage: items,
            count: pagedRoots.TotalCount,
            pageNumber: pagedRoots.CurrentPage,
            pageSize: pagedRoots.PageSize
        )
        {
            TotalPages = pagedRoots.TotalPages
        };

        return Result<IPagedList<CommentResponse>>.Success(paged);
    }

    public async Task<Result<bool>> UpdateAsync(int userId, int announcementId, int commentId, UpdateCommentModel model)
    {
        if (string.IsNullOrWhiteSpace(model.CommentMessage))
        {
            return Result<bool>.Failure(UserErrors.RequiredField("commentMessage"));
        }

        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.AnnouncementId == announcementId);
        if (comment is null)
        {
            return Result<bool>.Failure(Error.NotFound("Comment.NotFound", "Comment not found"));
        }

        if (comment.UserId != userId)
        {
            return Result<bool>.Failure(Error.Forbidden("Comment.Forbidden", "Only the author can edit this comment"));
        }

        if (comment.IsDeleted)
        {
            return Result<bool>.Failure(Error.Validation("Comment.Deleted", "Cannot edit a deleted comment"));
        }

        comment.CommentMessage = model.CommentMessage.Trim();
        comment.ImageUrl = string.IsNullOrWhiteSpace(model.ImageUrl) ? null : model.ImageUrl.Trim();
        comment.Latitude = model.Latitude;
        comment.Longitude = model.Longitude;
        comment.LocationDescription = string.IsNullOrWhiteSpace(model.LocationDescription) ? null : model.LocationDescription.Trim();
        comment.LastModifiedOn = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> SoftDeleteAsync(int userId, int announcementId, int commentId)
    {
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.AnnouncementId == announcementId);
        if (comment is null)
        {
            return Result<bool>.Failure(Error.NotFound("Comment.NotFound", "Comment not found"));
        }

        if (comment.UserId != userId)
        {
            return Result<bool>.Failure(Error.Forbidden("Comment.Forbidden", "Only the author can delete this comment"));
        }

        if (comment.IsDeleted)
        {
            return Result<bool>.Success(true);
        }

        var now = DateTimeOffset.UtcNow;
        comment.IsDeleted = true;
        comment.DeletedAt = now;
        comment.LastModifiedOn = now;
        comment.CommentMessage = string.Empty;
        comment.ImageUrl = null;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    private static CommentResponse BuildTree(Comment comment, Dictionary<int, List<Comment>> byParent)
    {
        var response = MapComment(comment, includeReplies: false);

        if (byParent.TryGetValue(comment.Id, out var children))
        {
            response.Replies = children
                .Select(child => BuildTree(child, byParent))
                .ToList();
        }

        return response;
    }

    private static CommentResponse MapComment(Comment comment, bool includeReplies)
    {
        return new CommentResponse
        {
            Id = comment.Id,
            AnnouncementId = comment.AnnouncementId,
            ParentCommentId = comment.ParentCommentId,
            CommentMessage = comment.IsDeleted ? DeletedPlaceholder : comment.CommentMessage,
            ImageUrl = comment.IsDeleted ? null : comment.ImageUrl,
            Latitude = comment.Latitude,
            Longitude = comment.Longitude,
            LocationDescription = comment.LocationDescription,
            CommentedAt = comment.CommentedAt,
            LastModifiedOn = comment.LastModifiedOn,
            IsDeleted = comment.IsDeleted,
            DeletedAt = comment.DeletedAt,
            Author = new CommentAuthorResponse
            {
                Id = comment.UserId,
                UserName = comment.Author?.UserName ?? string.Empty
            },
            Replies = includeReplies ? new List<CommentResponse>() : new List<CommentResponse>()
        };
    }
}
