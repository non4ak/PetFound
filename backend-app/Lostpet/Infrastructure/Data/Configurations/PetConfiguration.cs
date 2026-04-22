using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PetConfiguration : IEntityTypeConfiguration<Pet>
{
    public void Configure(EntityTypeBuilder<Pet> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).UseIdentityByDefaultColumn();

        builder.Property(p => p.PetName).HasMaxLength(256).IsRequired();
        builder.Property(p => p.Breed).HasMaxLength(256);
        builder.Property(p => p.Color).HasMaxLength(128);
        builder.Property(p => p.Description).HasMaxLength(4000);
        builder.Property(p => p.PetPhotoUrl).HasMaxLength(2048);
        builder.Property(p => p.ChipNumber).HasMaxLength(64);

        builder.HasOne(p => p.User)
            .WithMany(u => u.Pets)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
  ***REMOVED***
}
