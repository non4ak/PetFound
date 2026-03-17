using Domain.Models.Auth;

namespace Application.Auth.Interfaces;

public interface IRoleService
{
    public Task<bool> AddToRolesAsync(ApplicationUser user, string role);
}
