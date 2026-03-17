using Application.Auth.Interfaces;
using Domain.Models;
using Domain.Models.Auth;
using Domain.Models.DTOS.Auth.Models;
using Domain.Models.DTOS.Auth.Responses;
using Infrastructure.Common.Email;
using Infrastructure.Common.Errors.Auth;
using Infrastructure.Common.Errors.Common;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.JWT;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Auth.Services;

public class AuthService : IAuthService
{
    private readonly SignInManager<ApplicationUser> _signInManager;

    private readonly UserManager<ApplicationUser> _userManager;

    private readonly ITokenService _tokenService;

    private readonly IRoleService _roleService;

    private readonly ApplicationDbContext _context;

    private readonly IEmailService _emailService;

    public AuthService(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        IRoleService roleService,
        ApplicationDbContext context,
        IEmailService emailService
    )
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tokenService = tokenService;
        _roleService = roleService;
        _emailService = emailService;
        _context = context;
    }

    private string GenerateToken(ApplicationUser user)
    {
        var token = _tokenService.GenerateToken(user);

        return token;
    }

    public async Task<Result<int>> GetIdByEmail(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return Result<int>.Failure(UserErrors.UserNotFoundError());

        return Result<int>.Success(user.Id);
    }

    public async Task<Result<IEnumerable<string>>> GetRolesByEmail(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return Result<IEnumerable<string>>.Success(roles);
        }

        return Result<IEnumerable<string>>.Failure(UserErrors.UserNotFoundError());
    }

    public async Task<Result<bool>> RegisterAsync(RegisterModel registerModel)
    {
        await _context.Database.BeginTransactionAsync();
        try
        {
            var appUser = new ApplicationUser
            {
                UserName = registerModel.UserName,
                Email = registerModel.Email,
            };

            var userResult = await _userManager.CreateAsync(appUser, registerModel.Password);

            if (!userResult.Succeeded)
            {
                await _context.Database.RollbackTransactionAsync();
                return Result<bool>.Failure(UserErrors.UserNotCreatedError(userResult.Errors.First().Description));
            }

            var resRolesResult = await _roleService.AddToRolesAsync(appUser, UserRoles.User);


            if (resRolesResult == false)
            {
                await _context.Database.RollbackTransactionAsync();
                return Result<bool>.Failure(UserErrors.UserNotAssignedToRole());
            }

            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
            await _emailService.SendConfirmationLinkAsync(appUser.Email, emailToken);

            await _context.Database.CommitTransactionAsync();
            return Result<bool>.Success(true);
        }
        catch (DbUpdateException ex)
        {
            await _context.Database.RollbackTransactionAsync();
            return Result<bool>.Failure(RepositoryErrorMapper<ApplicationUser>.Map(ex));
        }
    }

    public async Task<Result<LoginResponse>> LoginAsync(LoginModel loginModel)
    {
        var user = await _userManager.FindByEmailAsync(loginModel.Login) ??
                   await _userManager.FindByNameAsync(loginModel.Login);

        if (user is null)
        {
            return Result<LoginResponse>.Failure(UserErrors.UserNotFoundError());
        }

        if (!await _userManager.IsEmailConfirmedAsync(user))
        {
            return Result<LoginResponse>.Failure(UserErrors.UserEmailNotConfirmed());
        }

        var result = await _userManager.CheckPasswordAsync(user, loginModel.Password);
        if (result)
        {
            return Result<LoginResponse>.Success(new LoginResponse
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = GenerateToken(user)
            });
        }

        if (await _userManager.IsLockedOutAsync(user))
        {
            return Result<LoginResponse>.Failure(UserErrors.UserLockedOut());
        }

        return Result<LoginResponse>.Failure(UserErrors.UserInvalidCredentials());
    }

    public async Task<Result> ConfirmEmailAsync(string email, string token)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            await _emailService.SendErrorEmailAsync(email, "User account wasn't found to be activated",
                "Account NOT activated");
            return Result.Failure(UserErrors.UserNotFoundError());
        }

        var confirmResult = await _userManager.ConfirmEmailAsync(user, token);
        if (!confirmResult.Succeeded)
        {
            await _emailService.SendErrorEmailAsync(email,
                "Account wasn't activated because the token either invalid or expired.", "Account NOT activated");
            return Result.Failure(EmailError.InvalidOrExpiredToken());
        }

        await _emailService.SendSuccessfulEmailAsync(email, "Account was successfully activated", "Account activated");

        return Result.Success();
    }

    public async Task<Result<bool>> LogoutAsync()
    {
        await _signInManager.SignOutAsync();

        return Result<bool>.Success(true);
    }


    public async Task<Result<bool>> ForgotPassword(string email)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user is null)
            {
                return Result<bool>.Failure(UserErrors.UserNotFoundError());
            }

            var passwordToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            await _emailService.SendForgotPasswordLinkAsync(email, passwordToken);

            return Result<bool>.Success(true);
        }
        catch (Exception)
        {
            return Result<bool>.Failure(EmailError.EmailNotSent());
        }
    }

    public async Task<Result<bool>> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
        }

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

        if (result.Succeeded)
        {
            return Result<bool>.Success(true);
        }

        return Result<bool>.Failure(PasswordErrors.PasswordNotChangedError());
    }
}
