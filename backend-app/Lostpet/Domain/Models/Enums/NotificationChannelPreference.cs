namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum NotificationChannelPreference
{
    [Display(Name = "Email and push")]
    Both = 0,
    [Display(Name = "Email only")]
    EmailOnly = 1,
    [Display(Name = "Push only")]
    PushOnly = 2,
}
