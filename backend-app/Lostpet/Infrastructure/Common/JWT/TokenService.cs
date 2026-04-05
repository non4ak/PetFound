using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain.Models.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Common.JWT;

public class TokenService : ITokenService
{
    private readonly JWTConfig _jwtConfig;

    public TokenService(IConfiguration config)
    {
        _jwtConfig = config.GetSection("JWTConfig").Get<JWTConfig>()
                     ?? throw new InvalidOperationException("JWTConfig section is missing.");
    }

    public string GenerateAuthToken(ApplicationUser user, IEnumerable<string>? roles)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new("id", user.Id.ToString()),
            new("email", user.Email ?? string.Empty),
            new("username", user.UserName ?? string.Empty)
        };

        if (roles is not null)
        {
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtConfig.ExpirationInMinutes),
            SigningCredentials = credentials,
            Issuer = _jwtConfig.Issuer,
            Audience = _jwtConfig.Audience,
        };

        var tokenHandler = new JsonWebTokenHandler();

        return tokenHandler.CreateToken(tokenDescriptor);
    }

    public RefreshTokenDTO GenerateRefreshToken()
    {
        var raw = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        return new RefreshTokenDTO
        {
            Bytes = Base64UrlEncoder.Encode(raw),
            ExpirationTimeInDays = _jwtConfig.RefreshTokenExpirationInDays
        };
    }
}
