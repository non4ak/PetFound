using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id).UseIdentityByDefaultColumn();

        builder.Property(c => c.Latitude).HasPrecision(9, 6);
        builder.Property(c => c.Longitude).HasPrecision(9, 6);
        builder.Property(c => c.LocationDescription).HasMaxLength(512);
        builder.Property(c => c.CommentMessage).HasMaxLength(4000).IsRequired();
        builder.Property(c => c.ImageUrl).HasMaxLength(2048);

        builder.HasOne(c => c.Announcement)
            .WithMany(a => a.Comments)
            .HasForeignKey(c => c.AnnouncementId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Author)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);
  ***REMOVED***
}
