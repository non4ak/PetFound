namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum PetSize
{
    [Display(Name = "Small")]
    Small = 0,
    [Display(Name = "Medium")]
    Medium = 1,
    [Display(Name = "Large")]
    Large = 2,
}
