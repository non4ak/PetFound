namespace Infrastructure.Common.Cookies;

public interface ICookieService
{
    void SetAuthCookies(string accessToken, string refreshToken);

    void ClearAuthCookies();

    string? GetRefreshToken();
}
