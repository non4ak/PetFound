namespace Domain.Models.Auth;

public class RefreshToken
{
    public int Id { get; set; }

    public string Token { get; set; } = string.Empty;

    public int UserId { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public DateTime ExpiresOnUtc { get; set; }
}
