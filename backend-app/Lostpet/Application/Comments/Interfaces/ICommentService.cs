using Domain.Models.DTOS.Comments.Models;
using Domain.Models.DTOS.Comments.Responses;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.Comments.Interfaces;

public interface ICommentService
{
    Task<Result<CommentResponse>> CreateAsync(int userId, int announcementId, CreateCommentModel model);

    Task<Result<IPagedList<CommentResponse>>> GetThreadAsync(int announcementId, int pageNumber, int pageSize);

    Task<Result<bool>> UpdateAsync(int userId, int announcementId, int commentId, UpdateCommentModel model);

    Task<Result<bool>> SoftDeleteAsync(int userId, int announcementId, int commentId);
}
