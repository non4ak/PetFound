namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum AnnouncementProcessingStatus
{
    [Display(Name = "Pending")]
    Pending = 0,

    [Display(Name = "Vectorized")]
    Vectorized = 1,

    [Display(Name = "Matched")]
    Matched = 2,

    [Display(Name = "Photo failed")]
    PhotoFailed = 3,
}
