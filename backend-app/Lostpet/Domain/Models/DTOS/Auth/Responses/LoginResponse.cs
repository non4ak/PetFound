namespace Domain.Models.DTOS.Auth.Responses;

public class LoginResponse
{
    public string UserName { get; set; }

    public string Email { get; set; }

    public required string Role { get; set; }
}
