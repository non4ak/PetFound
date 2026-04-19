using Domain.Models.Auth;
using Domain.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations.Auth;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.Country).HasMaxLength(128);
        builder.Property(u => u.City).HasMaxLength(128);
        builder.Property(u => u.SocialNetwork).HasMaxLength(512);

        builder.Property(u => u.NotificationChannelPreference)
            .HasDefaultValue(NotificationChannelPreference.Both);
    }
}
