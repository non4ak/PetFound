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

    public Task<Result> ConfirmEmailAsync(string email, string token);

    public Task<Result<bool>> LogoutAsync();

    public Task<Result<bool>> ForgotPassword(string email);

    public Task<Result<bool>> ResetPasswordAsync(string email, string token, string newPassword);
}
