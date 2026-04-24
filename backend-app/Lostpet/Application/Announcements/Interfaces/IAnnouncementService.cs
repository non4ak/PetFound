using Domain.Models.DTOS.Announcements.Models;
using Domain.Models.DTOS.Announcements.Responses;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.Announcements.Interfaces;

public interface IAnnouncementService
{
    Task<Result<AnnouncementResponse>> CreateAsync(int userId, CreateAnnouncementModel model);

    Task<Result<IPagedList<AnnouncementResponse>>> GetPagedAsync(int pageNumber, int pageSize);

    Task<Result<AnnouncementDetailsResponse>> GetByIdAsync(int id);
}

