using Domain.Models;
using Domain.Models.Auth;
using Infrastructure.Data.Configurations;
using Infrastructure.Data.Configurations.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Pet> Pets { get; set; }

    public DbSet<Announcement> Announcements { get; set; }

    public DbSet<Comment> Comments { get; set; }

    public DbSet<Notification> Notifications { get; set; }

    public DbSet<MatchResult> MatchResults { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
        modelBuilder.ApplyConfiguration(new ApplicationUserConfiguration());
        modelBuilder.ApplyConfiguration(new PetConfiguration());
        modelBuilder.ApplyConfiguration(new AnnouncementConfiguration());
        modelBuilder.ApplyConfiguration(new CommentConfiguration());
        modelBuilder.ApplyConfiguration(new MatchResultConfiguration());
        modelBuilder.ApplyConfiguration(new NotificationConfiguration());
    }
}
