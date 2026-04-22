namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum PetAgeCategory
{
    [Display(Name = "Baby")]
    Baby = 0,
    [Display(Name = "Young")]
    Young = 1,
    [Display(Name = "Adult")]
    Adult = 2,
    [Display(Name = "Senior")]
    Senior = 3,
}
