namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum PetType
{
    [Display(Name = "Cat")]
    Cat = 0,
    [Display(Name = "Dog")]
    Dog = 1,
}
