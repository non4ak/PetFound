namespace Infrastructure.Common.Errors.Auth;

public class PasswordErrors
{
    public static Error PasswordNotChangedError()
    {
        return Error.Validation("User.PasswordNotChanged","The password wasn't changed");
    }
}
