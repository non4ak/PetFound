using Domain.Models.DTOS.AdminComments.Models;
using Domain.Models.DTOS.AdminComments.Responses;
using Domain.Models.DTOS.Comments.Models;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.AdminComments.Interfaces;

public interface IAdminCommentService
{
    Task<Result<IPagedList<AdminCommentListItemDto>>> ListAsync(
        AdminCommentListQueryModel query,
        int pageNumber,
        int pageSize);

    Task<Result<bool>> UpdateAsync(int announcementId, int commentId, UpdateCommentModel model);

    Task<Result<bool>> SoftDeleteAsync(int announcementId, int commentId);
}
