namespace Domain.Models.DTOS.Comments.Responses;

public class CommentResponse
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

    public CommentAuthorResponse Author { get; set; } = new();

    public List<CommentResponse> Replies { get; set; } = new();
}

public class CommentAuthorResponse
{
    public int Id { get; set; }

    public string UserName { get; set; } = string.Empty;
}
