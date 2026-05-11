namespace Infrastructure.Common.Errors.Auth;

public class GoogleAuthErrors
{
    public static Error InvalidGoogleToken(string description)
    {
        return Error.Unauthorized("GoogleAuth.InvalidToken", $"Invalid Google ID token: {description}");
  ***REMOVED***

    public static Error UserNotAssignedExternalLoginError()
    {
        return Error.InternalServerError("GoogleAuth.ExternalLogin", "Could not link Google login to the user");
  ***REMOVED***
}
