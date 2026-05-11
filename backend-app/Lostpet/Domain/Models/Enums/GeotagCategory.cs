using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Enums;

public enum GeotagCategory
{
    [Display(Name = "Vet clinic")]
    VetClinic = 0,

    [Display(Name = "Shelter")]
    Shelter = 1,

    [Display(Name = "Feeding point")]
    FeedingPoint = 2,

    [Display(Name = "Pet shop")]
    PetShop = 3,

    [Display(Name = "Park")]
    Park = 4,

    [Display(Name = "Other")]
    Other = 5,
}
