namespace Domain.Models.Enums;

using System.ComponentModel.DataAnnotations;

public enum NotificationType
{
    [Display(Name = "New comment")]
    NewComment = 0,
    [Display(Name = "Match found")]
    MatchFound = 1,
}
