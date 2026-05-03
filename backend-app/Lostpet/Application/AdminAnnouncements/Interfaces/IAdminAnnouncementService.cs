using Domain.Models.DTOS.AdminAnnouncements.Models;
using Domain.Models.DTOS.AdminAnnouncements.Responses;
using Domain.Models.DTOS.Announcements.Models;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.AdminAnnouncements.Interfaces;

public interface IAdminAnnouncementService
{
    Task<Result<IPagedList<AdminAnnouncementListItemDto>>> ListAsync(
        AdminAnnouncementListQueryModel query,
        int pageNumber,
        int pageSize);

    Task<Result<AdminAnnouncementDetailsDto>> GetByIdAsync(int id);

    Task<Result<bool>> UpdateAsync(int id, UpdateAnnouncementModel model);

    Task<Result<bool>> ArchiveAsync(int id);

    Task<Result<bool>> RestoreAsync(int id);
}
