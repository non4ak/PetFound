namespace Domain.Models.DTOS.Auth.Responses;

public class MobileLoginResponse
{
    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public required string Role { get; set; }

    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;
}
