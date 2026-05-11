namespace Domain.Models.DTOS.AdminStatistics.Responses;

public class StatisticsSummaryResponse
{
    public int TotalUsers { get; set; }

    public int UsersOnboarded { get; set; }

    public int UsersRegisteredLast30Days { get; set; }

    public int TotalAnnouncements { get; set; }

    public int ActiveAnnouncements { get; set; }

    public int ArchivedAnnouncements { get; set; }

    public int LostAnnouncements { get; set; }

    public int FoundAnnouncements { get; set; }

    public int AnnouncementsLast30Days { get; set; }

    public int TotalComments { get; set; }

    public int CommentsLast30Days { get; set; }

    public int TotalPets { get; set; }
}
