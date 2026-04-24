using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
{
    public void Configure(EntityTypeBuilder<Announcement> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id).UseIdentityByDefaultColumn();

        builder.Property(a => a.Country).HasMaxLength(128);
        builder.Property(a => a.City).HasMaxLength(128);
        builder.Property(a => a.LastSeenLatitude).HasPrecision(9, 6);
        builder.Property(a => a.LastSeenLongitude).HasPrecision(9, 6);
        builder.Property(a => a.NearLandmark).HasMaxLength(512);
        builder.Property(a => a.ApproximateTime).HasMaxLength(64);
        builder.Property(a => a.PetDetails).HasMaxLength(4000);

        builder.HasOne(a => a.Pet)
            .WithMany(p => p.Announcements)
            .HasForeignKey(a => a.PetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.ReporterUser)
            .WithMany()
            .HasForeignKey(a => a.ReporterUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => a.ReporterUserId);
  ***REMOVED***
}
