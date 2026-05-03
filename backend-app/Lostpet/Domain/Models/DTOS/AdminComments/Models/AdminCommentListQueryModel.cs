namespace Domain.Models.DTOS.AdminComments.Models;

public class AdminCommentListQueryModel
{
    public int? AnnouncementId { get; set; }

    public bool? IsDeleted { get; set; }

    public string? SortDirection { get; set; }
}
