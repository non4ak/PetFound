using Domain.Models.Enums;

namespace Domain.Models.DTOS.Geotags.Responses;

public class GeotagResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public GeotagCategory Category { get; set; }

    public string CategoryLabel { get; set; } = string.Empty;

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public string? Address { get; set; }

    public string? PhotoUrl { get; set; }

    public int CreatedByUserId { get; set; }

    public DateTimeOffset CreatedOn { get; set; }
}
