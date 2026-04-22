using Domain.Models.Enums;

namespace Domain.Models.DTOS.Pets.Models;

public class CreatePetModel
{
    public string? PetPhotoUrl { get; set; }

    public string? PetName { get; set; }

    public PetType? PetType { get; set; }

    public PetSex? PetSex { get; set; }

    public PetSize? PetSize { get; set; }

    public PetAgeCategory? PetAgeCategory { get; set; }

    public string? Breed { get; set; }

    public string? ChipNumber { get; set; }

    public string? Description { get; set; }
}

