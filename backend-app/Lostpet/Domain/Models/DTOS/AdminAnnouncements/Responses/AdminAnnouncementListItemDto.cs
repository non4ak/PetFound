using Domain.Models.Enums;

namespace Domain.Models.DTOS.AdminAnnouncements.Responses;

public class AdminAnnouncementListItemDto
{
    public int Id { get; set; }

    public int PetId { get; set; }

    public AnnouncementPetStatus PetStatus { get; set; }

    public string PetStatusLabel { get; set; } = string.Empty;

    public PetType PetType { get; set; }

    public string PetTypeLabel { get; set; } = string.Empty;

    public string? Country { get; set; }

    public string? City { get; set; }

    public bool IsActive { get; set; }

    public DateTimeOffset CreatedOn { get; set; }

    public int ReporterUserId { get; set; }

    public string? ReporterUserName { get; set; }

    public string? ReporterEmail { get; set; }
}
