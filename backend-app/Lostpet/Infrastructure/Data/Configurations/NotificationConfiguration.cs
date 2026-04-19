using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Id).UseIdentityByDefaultColumn();

        builder.Property(n => n.Message).HasMaxLength(2000).IsRequired();

        builder.HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(n => n.MatchResult)
            .WithMany(m => m.Notifications)
            .HasForeignKey(n => n.MatchResultId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(n => n.Comment)
            .WithMany(c => c.Notifications)
            .HasForeignKey(n => n.CommentId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
