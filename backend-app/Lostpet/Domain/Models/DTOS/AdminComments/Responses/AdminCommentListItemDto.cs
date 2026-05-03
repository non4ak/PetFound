using Domain.Models.Enums;

namespace Domain.Models.DTOS.AdminComments.Responses;

public class AdminCommentListItemDto
{
    public int Id { get; set; }

    public int AnnouncementId { get; set; }

    public int? ParentCommentId { get; set; }

    public string CommentMessage { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? LocationDescription { get; set; }

    public DateTimeOffset CommentedAt { get; set; }

    public DateTimeOffset? LastModifiedOn { get; set; }

    public bool IsDeleted { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }

    public int AuthorUserId { get; set; }

    public string AuthorUserName { get; set; } = string.Empty;

    public AnnouncementPetStatus AnnouncementPetStatus { get; set; }

    public string AnnouncementPetStatusLabel { get; set; } = string.Empty;

    public string? AnnouncementCity { get; set; }

    public string? AnnouncementCountry { get; set; }
}
