using Domain.Models.DTOS.Auth.Models;
using Domain.Models.DTOS.Auth.Responses;
using Infrastructure.Common.ResultPattern;

namespace Application.Auth.Interfaces;

public interface IAuthService
{
    public Task<Result<int>> GetIdByEmail(string email);

    public Task<Result<IEnumerable<string>>> GetRolesByEmail(string email);

    public Task<Result<bool>> RegisterAsync(RegisterModel registerModel);

    public Task<Result<LoginResponse>> LoginAsync(LoginModel loginModel);

    public Task<Result<MobileLoginResponse>> LoginMobileAsync(LoginModel loginModel);

    public Task<Result<UserProfileResponse>> GetUserProfile(string? email);

    public Task<Result<bool>> UpdateUserProfile(int userId, UpdateProfileModel model);

    public Task<Result> RefreshToken();

    public Task<Result<MobileLoginResponse>> RefreshTokenMobile(string refreshToken);

    public Task<Result> ConfirmEmailAsync(string email, string token);

    public Task<Result<bool>> LogoutAsync(int userId);

    public Task<Result<bool>> ForgotPassword(string email);

    public Task<Result<bool>> ResetPasswordAsync(string email, string token, string newPassword);
}
