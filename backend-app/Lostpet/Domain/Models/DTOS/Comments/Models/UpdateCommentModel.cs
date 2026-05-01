namespace Domain.Models.DTOS.Comments.Models;

public class UpdateCommentModel
{
    public string? CommentMessage { get; set; }

    public string? ImageUrl { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? LocationDescription { get; set; }
}
