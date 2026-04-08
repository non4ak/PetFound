using Domain.Models.Auth;

namespace Infrastructure.Common.JWT;

public interface ITokenService
{
    string GenerateAuthToken(ApplicationUser user, IEnumerable<string>? roles);

    RefreshTokenDTO GenerateRefreshToken();
}
