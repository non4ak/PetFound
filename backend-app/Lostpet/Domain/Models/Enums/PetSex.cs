namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum PetSex
{
    [Display(Name = "Unknown")]
    Unknown = 0,
    [Display(Name = "Male")]
    Male = 1,
    [Display(Name = "Female")]
    Female = 2,
}
