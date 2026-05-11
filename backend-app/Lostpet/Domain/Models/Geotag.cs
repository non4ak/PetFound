using Domain.Models.Auth;
using Domain.Models.Enums;

namespace Domain.Models;

public class Geotag : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public GeotagCategory Category { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public string? Address { get; set; }

    public string? PhotoUrl { get; set; }

    public int CreatedByUserId { get; set; }

    public ApplicationUser CreatedByUser { get; set; } = null!;
}
