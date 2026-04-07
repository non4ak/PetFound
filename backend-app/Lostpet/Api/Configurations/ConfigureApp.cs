using Infrastructure.Data;

namespace Api.Configurations;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        var config = app.Configuration;

        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        using (var scope = app.Services.CreateScope())
        {
            var seeder = new DatabaseSeeder(scope);
            await seeder.SeedAsync();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseCors(options =>
        {
            var origins = config.GetSection("Cors:AllowedOrigins").Get<string[]>()
                          ?? new[] { "http://localhost:5173" };

            options
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithOrigins(origins);
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}
