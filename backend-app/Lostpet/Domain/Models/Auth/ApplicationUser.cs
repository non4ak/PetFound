using Domain.Models;
using Domain.Models.Enums;
using Microsoft.AspNetCore.Identity;

namespace Domain.Models.Auth;

public class ApplicationUser : IdentityUser<int>
{
    public DateTimeOffset RegisteredAt { get; set; }

    public bool IsOnboardingCompleted { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? SocialNetwork { get; set; }

    public NotificationChannelPreference NotificationChannelPreference { get; set; } = NotificationChannelPreference.Both;

    public ICollection<Pet> Pets { get; set; } = new List<Pet>();

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
