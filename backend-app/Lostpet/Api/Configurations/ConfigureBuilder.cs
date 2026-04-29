using System.Text;
using Api.ApiResult;
using Api.Exceptions;
using Api.Swagger;
using Application.Announcements.Interfaces;
using Application.Announcements.Services;
using Application.AdminUsers.Interfaces;
using Application.AdminUsers.Services;
using Application.Auth.Interfaces;
using Application.Auth.Services;
using Application.Onboarding.Interfaces;
using Application.Onboarding.Services;
using Application.Pets.Interfaces;
using Application.Pets.Services;
using Application.Photos.Interfaces;
using Application.Photos.Services;
using Domain.Models.Auth;
using Infrastructure.Common;
using Infrastructure.Common.Cookies;
using Infrastructure.Common.Email;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.JWT;
using Infrastructure.Common.Mappers.Auth;
using Infrastructure.Common.Storage;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

namespace Api.Configurations;

public static class ConfigureBuilder
{
    public static void Configure(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var jwtConfig = builder.Configuration.GetSection("JWTConfig").Get<JWTConfig>()
                        ?? throw new InvalidOperationException("JWTConfig section is missing.");

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

        builder.Services.AddSerilog(s =>
            s.ReadFrom.Configuration(builder.Configuration));

        services.AddDbContext<ApplicationDbContext>(opts =>
        {
            opts.UseNpgsql(builder.Configuration.GetConnectionString("DataContext"));
      ***REMOVED***);

        services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 3;

                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);

                options.User.RequireUniqueEmail = true;
          ***REMOVED***)
            .AddDefaultTokenProviders()
            .AddRoles<IdentityRole<int>>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        builder.Services.AddControllers();

        builder.Services.AddEndpointsApiExplorer();
        AddSwagger(builder);

        builder.Services.AddProblemDetails();

        builder.Services.AddAuthorization();

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
          ***REMOVED***)
            .AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Key)),
                    ValidIssuer = jwtConfig.Issuer,
                    ValidAudience = jwtConfig.Audience,
                    ClockSkew = TimeSpan.Zero,
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role
              ***REMOVED***;
                o.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Cookies[AppConstants.AccessTokenCookie];
                        if (!string.IsNullOrEmpty(accessToken))
                        {
                            context.Token = accessToken;
                      ***REMOVED***

                        return Task.CompletedTask;
                  ***REMOVED***,
                    OnChallenge = async context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";
                        var payload = ApiResults.ToProblemDetailsObject(UserErrors.Unauthorized());
                        await context.Response.WriteAsJsonAsync(payload);
                  ***REMOVED***
              ***REMOVED***;
          ***REMOVED***);

        builder.Services.AddHttpContextAccessor();
        builder.Services.Configure<AzureBlobStorageConfig>(builder.Configuration.GetSection("AzureBlobStorage"));
        builder.Services.AddAutoMapper(cfg => cfg.AddProfile<AuthMappingProfile>());
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<IRoleService, RoleService>();
        builder.Services.AddScoped<ICookieService, CookieService>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IEmailService, EmailService>();
        builder.Services.AddScoped<IAdminUserService, AdminUserService>();
        builder.Services.AddScoped<IOnboardingService, OnboardingService>();
        builder.Services.AddScoped<IPetService, PetService>();
        builder.Services.AddScoped<IAnnouncementService, AnnouncementService>();
        builder.Services.AddScoped<IPhotoUploadService, PhotoUploadService>();
  ***REMOVED***

    private static void AddSwagger(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        services.AddSwaggerGen(option =>
        {
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "Lostpet API", Version = "v1" });
            option.OperationFilter<OnboardingRequestExampleOperationFilter>();
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
          ***REMOVED***);
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                      ***REMOVED***
                  ***REMOVED***,
                    new string[] { }
              ***REMOVED***
          ***REMOVED***);
      ***REMOVED***);
  ***REMOVED***
}
