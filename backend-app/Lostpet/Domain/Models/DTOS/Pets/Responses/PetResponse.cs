using Domain.Models.Enums;

namespace Domain.Models.DTOS.Pets.Responses;

public class PetResponse
{
    public int Id { get; set; }

    public string PetName { get; set; } = string.Empty;

    public PetType PetType { get; set; }

    public PetSex PetSex { get; set; }

    public PetSize PetSize { get; set; }

    public PetAgeCategory PetAgeCategory { get; set; }

    public string? Breed { get; set; }

    public string? ChipNumber { get; set; }

    public string? Description { get; set; }

    public string? PetPhotoUrl { get; set; }

    public DateTimeOffset CreatedOn { get; set; }
}

