using Domain.Models.Auth;

namespace Infrastructure.Common.JWT;

public interface ITokenService
{
    public string GenerateToken(ApplicationUser user);
}
