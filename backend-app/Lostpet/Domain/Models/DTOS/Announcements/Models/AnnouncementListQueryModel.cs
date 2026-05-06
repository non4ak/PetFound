using Domain.Models.Enums;

namespace Domain.Models.DTOS.Announcements.Models;

public class AnnouncementListQueryModel
{
    public string? Search { get; set; }

    public AnnouncementPetStatus? PetStatus { get; set; }

    public PetType? PetType { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public DateTimeOffset? CreatedFrom { get; set; }

    public DateTimeOffset? CreatedTo { get; set; }

    public bool? IsActive { get; set; }

    public string? SortBy { get; set; }

    public string? SortDirection { get; set; }
}

