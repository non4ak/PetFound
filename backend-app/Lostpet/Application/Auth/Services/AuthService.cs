using Application.Auth.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.Auth;
using Domain.Models.DTOS.Auth.Models;
using Domain.Models.DTOS.Auth.Responses;
using Infrastructure.Common.Cookies;
using Infrastructure.Common.Email;
using Infrastructure.Common.Errors.Auth;
using Infrastructure.Common.Errors.Common;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.Google;
using Infrastructure.Common.JWT;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
namespace Application.Auth.Services;

public class AuthService : IAuthService
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IRoleService _roleService;
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ICookieService _cookieService;
    private readonly IConfiguration _configuration;

    public AuthService(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        IRoleService roleService,
        ApplicationDbContext context,
        IEmailService emailService,
        ICookieService cookieService,
        IConfiguration configuration
    )
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tokenService = tokenService;
        _roleService = roleService;
        _emailService = emailService;
        _cookieService = cookieService;
        _context = context;
        _configuration = configuration;
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
                EmailConfirmed = true,
                RegisteredAt = DateTimeOffset.UtcNow,
                IsOnboardingCompleted = false,
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

        var result = await _userManager.CheckPasswordAsync(user, loginModel.Password);
        if (!result)
        {
            if (await _userManager.IsLockedOutAsync(user))
            {
                return Result<LoginResponse>.Failure(UserErrors.UserLockedOut());
            }

            return Result<LoginResponse>.Failure(UserErrors.UserInvalidCredentials());
        }

        await using var tx = await _context.Database.BeginTransactionAsync();
        RefreshToken refreshTokenEntity;
        try
        {
            var existing = await _context.RefreshTokens.Where(r => r.UserId == user.Id).ToListAsync();
            _context.RefreshTokens.RemoveRange(existing);

            var refreshTokenDto = _tokenService.GenerateRefreshToken();
            refreshTokenEntity = new RefreshToken
            {
                User = user,
                Token = refreshTokenDto.Bytes,
                ExpiresOnUtc = DateTime.UtcNow.AddDays(refreshTokenDto.ExpirationTimeInDays),
            };
            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();
            await tx.CommitAsync();
        }
        catch (DbUpdateException)
        {
            await tx.RollbackAsync();
            return Result<LoginResponse>.Failure(RepositoryErrors<RefreshToken>.AddError);
        }

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateAuthToken(user, roles);
        _cookieService.SetAuthCookies(accessToken, refreshTokenEntity.Token);

        var role = roles.Contains(UserRoles.Admin) ? UserRoles.Admin : UserRoles.User;

        return Result<LoginResponse>.Success(new LoginResponse
        {
            UserName = user.UserName!,
            Email = user.Email!,
            Role = role
        });
    }

    public async Task<Result<MobileLoginResponse>> LoginMobileAsync(LoginModel loginModel)
    {
        var user = await _userManager.FindByEmailAsync(loginModel.Login) ??
                   await _userManager.FindByNameAsync(loginModel.Login);

        if (user is null)
        {
            return Result<MobileLoginResponse>.Failure(UserErrors.UserNotFoundError());
        }

        var result = await _userManager.CheckPasswordAsync(user, loginModel.Password);
        if (!result)
        {
            if (await _userManager.IsLockedOutAsync(user))
            {
                return Result<MobileLoginResponse>.Failure(UserErrors.UserLockedOut());
            }

            return Result<MobileLoginResponse>.Failure(UserErrors.UserInvalidCredentials());
        }

        await using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            var existing = await _context.RefreshTokens.Where(r => r.UserId == user.Id).ToListAsync();
            _context.RefreshTokens.RemoveRange(existing);

            var refreshTokenDto = _tokenService.GenerateRefreshToken();
            var refreshTokenEntity = new RefreshToken
            {
                User = user,
                Token = refreshTokenDto.Bytes,
                ExpiresOnUtc = DateTime.UtcNow.AddDays(refreshTokenDto.ExpirationTimeInDays),
            };
            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAuthToken(user, roles);
            var role = roles.Contains(UserRoles.Admin) ? UserRoles.Admin : UserRoles.User;

            return Result<MobileLoginResponse>.Success(new MobileLoginResponse
            {
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = role,
                AccessToken = accessToken,
                RefreshToken = refreshTokenEntity.Token
            });
        }
        catch (DbUpdateException)
        {
            await tx.RollbackAsync();
            return Result<MobileLoginResponse>.Failure(RepositoryErrors<RefreshToken>.AddError);
        }
    }

    public async Task<Result<UserProfileResponse>> GetUserProfile(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return Result<UserProfileResponse>.Failure(UserErrors.Unauthorized());
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Result<UserProfileResponse>.Failure(UserErrors.UserNotFoundError());
        }

        var petEntities = await _context.Pets
            .AsNoTracking()
            .Where(p => p.UserId == user.Id)
            .OrderByDescending(p => p.CreatedOn)
            .ToListAsync();

        var pets = petEntities.Select(p => new UserProfilePetResponse
            {
                Id = p.Id,
                PetName = p.PetName,
                PetType = p.PetType,
                PetTypeLabel = p.PetType.GetDisplayName(),
                PetSex = p.PetSex,
                PetSexLabel = p.PetSex.GetDisplayName(),
                PetSize = p.PetSize,
                PetSizeLabel = p.PetSize.GetDisplayName(),
                PetAgeCategory = p.PetAgeCategory,
                PetAgeCategoryLabel = p.PetAgeCategory.GetDisplayName(),
                Breed = p.Breed,
                PetPhotoUrl = p.PetPhotoUrl
            })
            .ToList();

        return Result<UserProfileResponse>.Success(new UserProfileResponse
        {
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber,
            SocialNetwork = user.SocialNetwork,
            UserPhotoUrl = user.UserPhotoUrl,
            Country = user.Country,
            City = user.City,
            NotificationChannelPreference = user.NotificationChannelPreference,
            NotificationChannelPreferenceLabel = user.NotificationChannelPreference.GetDisplayName(),
            Pets = pets
        });
    }

    public async Task<Result<bool>> UpdateUserProfile(int userId, UpdateProfileModel model)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return Result<bool>.Failure(UserErrors.UserNotFoundError());
        }

        if (model.PhoneNumber is not null)
        {
            if (string.IsNullOrWhiteSpace(model.PhoneNumber))
            {
                return Result<bool>.Failure(UserErrors.RequiredField("phoneNumber"));
            }

            var phoneResult = await _userManager.SetPhoneNumberAsync(user, model.PhoneNumber.Trim());
            if (!phoneResult.Succeeded)
            {
                return Result<bool>.Failure(UserErrors.UserNotCreatedError(phoneResult.Errors.First().Description));
            }
        }

        if (model.SocialNetwork is not null)
        {
            user.SocialNetwork = string.IsNullOrWhiteSpace(model.SocialNetwork) ? null : model.SocialNetwork.Trim();
        }

        if (model.UserPhotoUrl is not null)
        {
            user.UserPhotoUrl = string.IsNullOrWhiteSpace(model.UserPhotoUrl) ? null : model.UserPhotoUrl.Trim();
        }

        if (model.Country is not null)
        {
            if (string.IsNullOrWhiteSpace(model.Country))
            {
                return Result<bool>.Failure(UserErrors.RequiredField("country"));
            }

            user.Country = model.Country.Trim();
        }

        if (model.City is not null)
        {
            if (string.IsNullOrWhiteSpace(model.City))
            {
                return Result<bool>.Failure(UserErrors.RequiredField("city"));
            }

            user.City = model.City.Trim();
        }

        if (model.NotificationChannelPreference.HasValue)
        {
            user.NotificationChannelPreference = model.NotificationChannelPreference.Value;
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return Result<bool>.Failure(UserErrors.UserNotCreatedError(result.Errors.First().Description));
        }

        return Result<bool>.Success(true);
    }

    public async Task<Result> RefreshToken()
    {
        var refreshToken = _cookieService.GetRefreshToken();
        if (string.IsNullOrEmpty(refreshToken))
        {
            await _signInManager.SignOutAsync();
            _cookieService.ClearAuthCookies();
            return Result.Failure(UserErrors.InvalidOrExpiredRefreshToken());
        }

        var stored = await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (stored is null || stored.ExpiresOnUtc < DateTime.UtcNow)
        {
            await _signInManager.SignOutAsync();
            _cookieService.ClearAuthCookies();
            return Result.Failure(UserErrors.InvalidOrExpiredRefreshToken());
        }

        await using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            var userId = stored.UserId;
            var user = stored.User;

            _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(r => r.UserId == userId));

            var refreshTokenDto = _tokenService.GenerateRefreshToken();
            var newRefreshToken = new RefreshToken
            {
                User = user,
                Token = refreshTokenDto.Bytes,
                ExpiresOnUtc = DateTime.UtcNow.AddDays(refreshTokenDto.ExpirationTimeInDays),
            };
            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAuthToken(user, roles);
            _cookieService.SetAuthCookies(accessToken, newRefreshToken.Token);

            return Result.Success();
        }
        catch (DbUpdateException)
        {
            await tx.RollbackAsync();
            return Result.Failure(RepositoryErrors<RefreshToken>.AddError);
        }
    }

    public async Task<Result<MobileLoginResponse>> RefreshTokenMobile(string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Result<MobileLoginResponse>.Failure(UserErrors.InvalidOrExpiredRefreshToken());
        }

        var stored = await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (stored is null || stored.ExpiresOnUtc < DateTime.UtcNow)
        {
            return Result<MobileLoginResponse>.Failure(UserErrors.InvalidOrExpiredRefreshToken());
        }

        await using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            var userId = stored.UserId;
            var user = stored.User;

            _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(r => r.UserId == userId));

            var refreshTokenDto = _tokenService.GenerateRefreshToken();
            var newRefreshToken = new RefreshToken
            {
                User = user,
                Token = refreshTokenDto.Bytes,
                ExpiresOnUtc = DateTime.UtcNow.AddDays(refreshTokenDto.ExpirationTimeInDays),
            };
            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAuthToken(user, roles);
            var role = roles.Contains(UserRoles.Admin) ? UserRoles.Admin : UserRoles.User;

            return Result<MobileLoginResponse>.Success(new MobileLoginResponse
            {
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = role,
                AccessToken = accessToken,
                RefreshToken = newRefreshToken.Token
            });
        }
        catch (DbUpdateException)
        {
            await tx.RollbackAsync();
            return Result<MobileLoginResponse>.Failure(RepositoryErrors<RefreshToken>.AddError);
        }
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

    public async Task<Result<bool>> LogoutAsync(int userId)
    {
        await _signInManager.SignOutAsync();
        try
        {
            var existing = await _context.RefreshTokens.Where(r => r.UserId == userId).ToListAsync();
            _context.RefreshTokens.RemoveRange(existing);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Result<bool>.Failure(RepositoryErrors<RefreshToken>.DeleteError);
        }
        _cookieService.ClearAuthCookies();
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

    public async Task<Result<LoginResponse>> LoginWithGoogleTokenAsync(string idToken)
    {
        try
        {
            var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(idToken, GetGoogleValidationSettings());

            var userInfo = new GoogleUserInfo
            {
                Sub = payload.Subject,
                Email = payload.Email,
                EmailVerified = payload.EmailVerified,
                Name = payload.Name,
                Picture = payload.Picture,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName
            };

            var loginResult = await LoginWithGoogleAsync(userInfo);
            if (!loginResult.IsSuccess)
            {
                return Result<LoginResponse>.Failure(loginResult.Error);
            }

            var user = await _userManager.FindByEmailAsync(userInfo.Email);
            if (user is null)
            {
                return Result<LoginResponse>.Failure(UserErrors.UserNotFoundError());
            }

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAuthToken(user, roles);

            var refreshToken = await _context.RefreshTokens
                .Where(r => r.UserId == user.Id)
                .OrderByDescending(r => r.Id)
                .FirstOrDefaultAsync();

            if (refreshToken is null)
            {
                return Result<LoginResponse>.Failure(UserErrors.InvalidOrExpiredRefreshToken());
            }

            _cookieService.SetAuthCookies(accessToken, refreshToken.Token);

            var role = roles.Contains(UserRoles.Admin) ? UserRoles.Admin : UserRoles.User;

            return Result<LoginResponse>.Success(new LoginResponse
            {
                UserName = user.UserName!,
                Email = user.Email!,
                Role = role
            });
        }
        catch (Exception ex)
        {
            return Result<LoginResponse>.Failure(GoogleAuthErrors.InvalidGoogleToken(ex.Message));
        }
    }

    public async Task<Result<MobileLoginResponse>> LoginWithGoogleTokenMobileAsync(string idToken)
    {
        try
        {
            var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(idToken, GetGoogleValidationSettings());

            var userInfo = new GoogleUserInfo
            {
                Sub = payload.Subject,
                Email = payload.Email,
                EmailVerified = payload.EmailVerified,
                Name = payload.Name,
                Picture = payload.Picture,
                FirstName = payload.GivenName,
                LastName = payload.FamilyName
            };

            var loginResult = await LoginWithGoogleAsync(userInfo);
            if (!loginResult.IsSuccess)
            {
                return Result<MobileLoginResponse>.Failure(loginResult.Error);
            }

            var user = await _userManager.FindByEmailAsync(userInfo.Email);
            if (user is null)
            {
                return Result<MobileLoginResponse>.Failure(UserErrors.UserNotFoundError());
            }

            var refreshToken = await _context.RefreshTokens
                .Where(r => r.UserId == user.Id)
                .OrderByDescending(r => r.Id)
                .FirstOrDefaultAsync();

            if (refreshToken is null)
            {
                return Result<MobileLoginResponse>.Failure(UserErrors.InvalidOrExpiredRefreshToken());
            }

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAuthToken(user, roles);

            return Result<MobileLoginResponse>.Success(new MobileLoginResponse
            {
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = roles.Contains(UserRoles.Admin) ? UserRoles.Admin : UserRoles.User,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token
            });
        }
        catch (Exception ex)
        {
            return Result<MobileLoginResponse>.Failure(GoogleAuthErrors.InvalidGoogleToken(ex.Message));
        }
    }

    private Google.Apis.Auth.GoogleJsonWebSignature.ValidationSettings GetGoogleValidationSettings()
    {
        var audiences = new List<string>();
        var web = _configuration["GoogleAuth:WebClientId"];
        var android = _configuration["GoogleAuth:AndroidClientId"];

        if (!string.IsNullOrWhiteSpace(web)) audiences.Add(web);
        if (!string.IsNullOrWhiteSpace(android)) audiences.Add(android);

        return new Google.Apis.Auth.GoogleJsonWebSignature.ValidationSettings
        {
            Audience = audiences
        };
    }

    private async Task<Result> LoginWithGoogleAsync(GoogleUserInfo userInfo)
    {
        const string loginProvider = "Google";

        var user = await _userManager.FindByLoginAsync(loginProvider, userInfo.Sub);
        if (user is null)
        {
            var emailUser = await _userManager.FindByEmailAsync(userInfo.Email);

            if (emailUser is null)
            {
                await using var tx = await _context.Database.BeginTransactionAsync();
                try
                {
                    var newUser = new ApplicationUser
                    {
                        UserName = userInfo.Email,
                        Email = userInfo.Email,
                        EmailConfirmed = true,
                        RegisteredAt = DateTimeOffset.UtcNow,
                        IsOnboardingCompleted = false,
                        UserPhotoUrl = userInfo.Picture
                    };

                    var userResult = await _userManager.CreateAsync(newUser);
                    if (!userResult.Succeeded)
                    {
                        await tx.RollbackAsync();
                        return Result.Failure(UserErrors.UserNotCreatedError(userResult.Errors.First().Description));
                    }

                    var rolesResult = await _roleService.AddToRolesAsync(newUser, UserRoles.User);
                    if (!rolesResult)
                    {
                        await tx.RollbackAsync();
                        return Result.Failure(UserErrors.UserNotAssignedToRole());
                    }

                    var loginInfo = new UserLoginInfo(loginProvider, userInfo.Sub, loginProvider);
                    var addLoginResult = await _userManager.AddLoginAsync(newUser, loginInfo);
                    if (!addLoginResult.Succeeded)
                    {
                        await tx.RollbackAsync();
                        return Result.Failure(GoogleAuthErrors.UserNotAssignedExternalLoginError());
                    }

                    await tx.CommitAsync();
                    user = newUser;
                }
                catch
                {
                    await tx.RollbackAsync();
                    throw;
                }
            }
            else
            {
                var loginInfo = new UserLoginInfo(loginProvider, userInfo.Sub, loginProvider);
                var addLoginResult = await _userManager.AddLoginAsync(emailUser, loginInfo);
                if (!addLoginResult.Succeeded)
                {
                    return Result.Failure(GoogleAuthErrors.UserNotAssignedExternalLoginError());
                }

                user = emailUser;
            }
        }

        if (await _userManager.IsLockedOutAsync(user))
        {
            return Result.Failure(UserErrors.UserLockedOut());
        }

        await using var refreshTx = await _context.Database.BeginTransactionAsync();
        try
        {
            var existing = await _context.RefreshTokens.Where(r => r.UserId == user.Id).ToListAsync();
            _context.RefreshTokens.RemoveRange(existing);

            var refreshTokenDto = _tokenService.GenerateRefreshToken();
            var refreshTokenEntity = new RefreshToken
            {
                User = user,
                Token = refreshTokenDto.Bytes,
                ExpiresOnUtc = DateTime.UtcNow.AddDays(refreshTokenDto.ExpirationTimeInDays)
            };
            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();
            await refreshTx.CommitAsync();
        }
        catch (DbUpdateException)
        {
            await refreshTx.RollbackAsync();
            return Result.Failure(RepositoryErrors<RefreshToken>.AddError);
        }

        return Result.Success();
    }
}
