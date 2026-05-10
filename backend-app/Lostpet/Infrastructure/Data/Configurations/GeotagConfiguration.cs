using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class GeotagConfiguration : IEntityTypeConfiguration<Geotag>
{
    public void Configure(EntityTypeBuilder<Geotag> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.Id).UseIdentityByDefaultColumn();

        builder.Property(g => g.Title).HasMaxLength(256).IsRequired();
        builder.Property(g => g.Description).HasMaxLength(2000);
        builder.Property(g => g.Address).HasMaxLength(512);
        builder.Property(g => g.PhotoUrl).HasMaxLength(1024);
        builder.Property(g => g.Latitude).HasPrecision(9, 6);
        builder.Property(g => g.Longitude).HasPrecision(9, 6);

        builder.HasOne(g => g.CreatedByUser)
            .WithMany()
            .HasForeignKey(g => g.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(g => g.Category);
        builder.HasIndex(g => new { g.Latitude, g.Longitude });
  ***REMOVED***
}
