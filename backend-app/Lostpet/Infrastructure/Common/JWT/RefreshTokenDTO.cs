namespace Infrastructure.Common.JWT;

public class RefreshTokenDTO
{
    public string Bytes { get; set; } = string.Empty;

    public int ExpirationTimeInDays { get; set; }
}
