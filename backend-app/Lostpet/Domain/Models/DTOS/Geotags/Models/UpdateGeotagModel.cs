using Domain.Models.Enums;

namespace Domain.Models.DTOS.Geotags.Models;

public class UpdateGeotagModel
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public GeotagCategory Category { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public string? Address { get; set; }

    public string? PhotoUrl { get; set; }
}
