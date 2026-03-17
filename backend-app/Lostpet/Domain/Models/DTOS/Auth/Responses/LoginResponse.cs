namespace Domain.Models.DTOS.Auth.Responses;

public class LoginResponse
{
    public string UserName { get; set; }

    public string Email { get; set; }

    public string Token { get; set; }
}
