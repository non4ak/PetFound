namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum MatchResultStatus
{
    [Display(Name = "Pending")]
    Pending = 0,
    [Display(Name = "Rejected")]
    Rejected = 1,
    [Display(Name = "Approved")]
    Approved = 2,
}
