namespace Domain.Models.DTOS.AdminStatistics.Responses;

public class StatisticsTimeseriesResponse
{
    public DateTimeOffset From { get; set; }

    public DateTimeOffset To { get; set; }

    public IEnumerable<StatisticsTimeseriesPoint> Announcements { get; set; } = Array.Empty<StatisticsTimeseriesPoint>();

    public IEnumerable<StatisticsTimeseriesPoint> Users { get; set; } = Array.Empty<StatisticsTimeseriesPoint>();

    public IEnumerable<StatisticsTimeseriesPoint> Comments { get; set; } = Array.Empty<StatisticsTimeseriesPoint>();
}

public class StatisticsTimeseriesPoint
{
    public DateTime Date { get; set; }

    public int Count { get; set; }
}
