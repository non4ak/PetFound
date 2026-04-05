using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Common.Cookies;

public class CookieService : ICookieService
{
    private readonly CookieOptions _accessTokenOptions;
    private readonly CookieOptions _refreshTokenOptions;
    private readonly HttpResponse _httpResponse;
    private readonly HttpRequest _httpRequest;

    public CookieService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        var cookieConfig = configuration.GetSection("CookieOptions").Get<CookieConfig>()
                           ?? throw new InvalidOperationException("CookieOptions section is required.");

        _httpRequest = httpContextAccessor.HttpContext?.Request
                        ?? throw new InvalidOperationException("HttpContext is not available.");
        _httpResponse = httpContextAccessor.HttpContext?.Response
                         ?? throw new InvalidOperationException("HttpContext is not available.");

        _accessTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = cookieConfig.UseSecureCookies,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddMinutes(cookieConfig.AccessTokenLifetimeInMinutes)
      ***REMOVED***;

        _refreshTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = cookieConfig.UseSecureCookies,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddDays(cookieConfig.RefreshTokenLifeTimeInDays)
      ***REMOVED***;
  ***REMOVED***

    public void SetAuthCookies(string accessToken, string refreshToken)
    {
        _httpResponse.Cookies.Append(AppConstants.AccessTokenCookie, accessToken, _accessTokenOptions);
        _httpResponse.Cookies.Append(AppConstants.RefreshTokenCookie, refreshToken, _refreshTokenOptions);
  ***REMOVED***

    public void ClearAuthCookies()
    {
        var expired = new CookieOptions
        {
            Expires = DateTimeOffset.UtcNow.AddDays(-1),
            HttpOnly = true,
            Secure = _accessTokenOptions.Secure,
            SameSite = SameSiteMode.Strict,
            Path = "/"
      ***REMOVED***;

        _httpResponse.Cookies.Append(AppConstants.AccessTokenCookie, "", expired);
        _httpResponse.Cookies.Append(AppConstants.RefreshTokenCookie, "", expired);
  ***REMOVED***

    public string? GetRefreshToken()
    {
        _httpRequest.Cookies.TryGetValue(AppConstants.RefreshTokenCookie, out var token);
        return token;
  ***REMOVED***
}
