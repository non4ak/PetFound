namespace Infrastructure.Common.Errors.Common;

public class EmailError
{
    public static Error EmailNotSent()
    {
        return Error.NotFound("Email.NotSent", "Email cannot be send to user");
    }

    public static Error InvalidOrExpiredToken()
    {
        return Error.NotFound("Email.InvalidOrExpiredToken", "Token to activate email is either invalid or expired");
    }
}
