using Domain.Models.DTOS.Announcements.Models;
using Domain.Models.DTOS.Announcements.Responses;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.Announcements.Interfaces;

public interface IAnnouncementService
{
    Task<Result<AnnouncementResponse>> CreateAsync(int userId, CreateAnnouncementModel model);

    Task<Result<IPagedList<AnnouncementResponse>>> GetPagedAsync(int pageNumber, int pageSize, AnnouncementListQueryModel queryModel);

    Task<Result<AnnouncementDetailsResponse>> GetByIdAsync(int id);

    Task<Result<bool>> UpdateAsync(int userId, int id, UpdateAnnouncementModel model);

    Task<Result<bool>> ArchiveAsync(int userId, int id);

    Task<Result<bool>> RestoreAsync(int userId, int id);
}

