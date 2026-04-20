namespace Infrastructure.Common.Errors.User;

public static class UserErrors
{
    public static Error UserNotFoundError()
    {
        return Error.NotFound("User.NotFound", "User not found");
  ***REMOVED***

    public static Error UserNotCreatedError(string description)
    {
        return Error.Validation("User.Validation", description);
  ***REMOVED***

    public static Error UserNotAssignedToRole()
    {
        return Error.InternalServerError("User.Roles", "User couldn't be assigned to roles");
  ***REMOVED***

    public static Error UserEmailNotConfirmed()
    {
        return Error.Unauthorized("User.Email.Confirmation", "User email not confirmed");
  ***REMOVED***

    public static Error UserLockedOut()
    {
        return Error.Unauthorized("User.Account.Locked", "User account is locked out");
  ***REMOVED***

    public static Error UserInvalidCredentials()
    {
        return Error.Unauthorized("User.Credentials.Invalid", "Wrong credentials, try again");
  ***REMOVED***

    public static Error InvalidOrExpiredRefreshToken()
    {
        return Error.Validation("User.RefreshToken.Invalid", "Refresh token that you provided is invalid or expired");
  ***REMOVED***

    public static Error Unauthorized()
    {
        return Error.Unauthorized("User.Unauthorized", "Unauthorized");
  ***REMOVED***

    public static Error RequiredField(string fieldName)
    {
        return Error.Validation("User.Validation.RequiredField", $"{fieldName} is required");
  ***REMOVED***
}
