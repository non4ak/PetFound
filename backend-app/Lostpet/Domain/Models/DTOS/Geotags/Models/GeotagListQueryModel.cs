using Domain.Models.Enums;

namespace Domain.Models.DTOS.Geotags.Models;

public class GeotagListQueryModel
{
    public string? Search { get; set; }

    public GeotagCategory? Category { get; set; }

    public decimal? MinLatitude { get; set; }

    public decimal? MaxLatitude { get; set; }

    public decimal? MinLongitude { get; set; }

    public decimal? MaxLongitude { get; set; }
}
