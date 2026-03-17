using Infrastructure.Data;

namespace Api.Configurations;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        var config = app.Configuration;

        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
      ***REMOVED***

        using (var scope = app.Services.CreateScope())
        {
            var seeder = new DatabaseSeeder(scope);
            await seeder.SeedAsync();
      ***REMOVED***

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseCors(options =>
        {
            options
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithOrigins(config.GetSection("ApplicationURLs")["FrontEnd"] ?? "http://localhost:3000");
      ***REMOVED***);

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
  ***REMOVED***
}
