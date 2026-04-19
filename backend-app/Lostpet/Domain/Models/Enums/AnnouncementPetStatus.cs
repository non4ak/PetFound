namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum AnnouncementPetStatus
{
    [Display(Name = "Lost")]
    Lost = 0,
    [Display(Name = "Found")]
    Found = 1,
}
