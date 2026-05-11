namespace Infrastructure.Common.Google;

public class GoogleUserInfo
{
    public string Sub { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public bool EmailVerified { get; set; }

    public string? Name { get; set; }

    public string? Picture { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }
}
