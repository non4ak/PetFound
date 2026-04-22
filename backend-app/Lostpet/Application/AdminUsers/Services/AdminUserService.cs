using Application.AdminUsers.Interfaces;
using Domain.Models;
using Domain.Models.Auth;
using Domain.Models.DTOS.AdminUsers.Models;
using Domain.Models.DTOS.AdminUsers.Responses;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.AdminUsers.Services;

public class AdminUserService : IAdminUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminUserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<Result<IPagedList<AdminUserListItemDto>>> ListUsersAsync(string? search, int pageNumber, int pageSize)
    {
        var query = _userManager.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(u =>
                (u.UserName != null && u.UserName.ToLower().Contains(s)) ||
                (u.Email != null && u.Email.ToLower().Contains(s)) ||
                (u.PhoneNumber != null && u.PhoneNumber.ToLower().Contains(s)));
        }

        query = query.OrderByDescending(u => u.RegisteredAt).ThenByDescending(u => u.Id);

        var pagedUsers = await PagedList<ApplicationUser>.CreateAsync(query, pageNumber, pageSize);

        var items = new List<AdminUserListItemDto>();
        foreach (var u in pagedUsers.Items)
        {
            var roles = await _userManager.GetRolesAsync(u);

            items.Add(new AdminUserListItemDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                Country = u.Country,
                City = u.City,
                PhoneNumber = u.PhoneNumber,
                SocialNetwork = u.SocialNetwork,
                NotificationChannelPreference = u.NotificationChannelPreference,
                RegisteredAt = u.RegisteredAt,
                LockoutEnd = u.LockoutEnd,
                IsDeactivated = u.LockoutEnabled && u.LockoutEnd.HasValue && u.LockoutEnd.Value > DateTimeOffset.UtcNow,
                Roles = roles
            });
        }

        IPagedList<AdminUserListItemDto> result = new PagedList<AdminUserListItemDto>(
            currentPage: items,
            count: pagedUsers.TotalCount,
            pageNumber: pagedUsers.CurrentPage,
            pageSize: pagedUsers.PageSize
        )
        {
            TotalPages = pagedUsers.TotalPages
        };

        return Result<IPagedList<AdminUserListItemDto>>.Success(result);
    }

    public async Task<Result<AdminUserDetailsDto>> GetUserAsync(int id)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null)
        {
            return Result<AdminUserDetailsDto>.Failure(UserErrors.UserNotFoundError());
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Result<AdminUserDetailsDto>.Success(new AdminUserDetailsDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Country = user.Country,
            City = user.City,
            PhoneNumber = user.PhoneNumber,
            SocialNetwork = user.SocialNetwork,
            NotificationChannelPreference = user.NotificationChannelPreference,
            RegisteredAt = user.RegisteredAt,
            EmailConfirmed = user.EmailConfirmed,
            PhoneNumberConfirmed = user.PhoneNumberConfirmed,
            LockoutEnabled = user.LockoutEnabled,
            LockoutEnd = user.LockoutEnd,
            AccessFailedCount = user.AccessFailedCount,
            TwoFactorEnabled = user.TwoFactorEnabled,
            Roles = roles
        });
    }

    public async Task<Result<bool>> UpdateUserAsync(int id, AdminUserUpdateModel model)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
        }

        if (model.Country != null) user.Country = model.Country;
        if (model.City != null) user.City = model.City;
        if (model.SocialNetwork != null) user.SocialNetwork = model.SocialNetwork;
        if (model.NotificationChannelPreference.HasValue) user.NotificationChannelPreference = model.NotificationChannelPreference.Value;

        if (model.PhoneNumber != null)
        {
            var phoneResult = await _userManager.SetPhoneNumberAsync(user, model.PhoneNumber);
            if (!phoneResult.Succeeded)
            {
                return Result<bool>.Failure(UserErrors.UserNotCreatedError(phoneResult.Errors.First().Description));
            }
        }

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return Result<bool>.Failure(UserErrors.UserNotCreatedError(updateResult.Errors.First().Description));
        }

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeactivateUserAsync(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
        }

        user.LockoutEnabled = true;
        user.LockoutEnd = DateTimeOffset.MaxValue;

        var res = await _userManager.UpdateAsync(user);
        if (!res.Succeeded)
        {
            return Result<bool>.Failure(UserErrors.UserNotCreatedError(res.Errors.First().Description));
        }

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> ActivateUserAsync(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
        }

        user.LockoutEnd = null;

        var res = await _userManager.UpdateAsync(user);
        if (!res.Succeeded)
        {
            return Result<bool>.Failure(UserErrors.UserNotCreatedError(res.Errors.First().Description));
        }

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> MakeAdminAsync(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
        }

        if (await _userManager.IsInRoleAsync(user, UserRoles.Admin))
        {
            return Result<bool>.Failure(UserErrors.UserAlreadyAdmin());
        }

        var result = await _userManager.AddToRoleAsync(user, UserRoles.Admin);
        if (!result.Succeeded)
        {
            return Result<bool>.Failure(UserErrors.UserNotCreatedError(result.Errors.First().Description));
        }

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteUserAsync(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
        }

        var res = await _userManager.DeleteAsync(user);
        if (!res.Succeeded)
        {
            return Result<bool>.Failure(UserErrors.UserNotCreatedError(res.Errors.First().Description));
        }

        return Result<bool>.Success(true);
    }
}

