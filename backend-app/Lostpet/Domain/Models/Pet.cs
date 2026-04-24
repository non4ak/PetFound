using Domain.Models.Auth;
using Domain.Models.Enums;

namespace Domain.Models;

public class Pet : BaseEntity
{
    public string PetName { get; set; } = string.Empty;

    public PetType PetType { get; set; }

    public PetSex PetSex { get; set; }

    public string? Breed { get; set; }

    public string? Color { get; set; }

    public PetSize PetSize { get; set; }

    public PetAgeCategory PetAgeCategory { get; set; }

    public string? Description { get; set; }

    public string? PetPhotoUrl { get; set; }

    public string? ChipNumber { get; set; }

    public int? UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
}
