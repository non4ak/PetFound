using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class MatchResultConfiguration : IEntityTypeConfiguration<MatchResult>
{
    public void Configure(EntityTypeBuilder<MatchResult> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id).UseIdentityByDefaultColumn();

        builder.Property(m => m.SimilarityScore).HasPrecision(5, 4);

        builder.HasOne(m => m.LostAnnouncement)
            .WithMany(a => a.MatchResultsAsLost)
            .HasForeignKey(m => m.LostAnnouncementId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(m => m.FoundAnnouncement)
            .WithMany(a => a.MatchResultsAsFound)
            .HasForeignKey(m => m.FoundAnnouncementId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(m => new { m.LostAnnouncementId, m.FoundAnnouncementId }).IsUnique();
  ***REMOVED***
}
