using Domain.Models.DTOS.AdminUsers.Models;
using Domain.Models.DTOS.AdminUsers.Responses;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.AdminUsers.Interfaces;

public interface IAdminUserService
{
    Task<Result<IPagedList<AdminUserListItemDto>>> ListUsersAsync(string? search, int pageNumber, int pageSize);

    Task<Result<AdminUserDetailsDto>> GetUserAsync(int id);

    Task<Result<bool>> UpdateUserAsync(int id, AdminUserUpdateModel model);

    Task<Result<bool>> DeactivateUserAsync(int id);

    Task<Result<bool>> ActivateUserAsync(int id);

    Task<Result<bool>> DeleteUserAsync(int id);
}

