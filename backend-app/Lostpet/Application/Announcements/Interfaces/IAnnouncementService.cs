using Domain.Models.DTOS.Announcements.Models;
using Domain.Models.DTOS.Announcements.Responses;
using Infrastructure.Common.ResultPattern;

namespace Application.Announcements.Interfaces;

public interface IAnnouncementService
{
    Task<Result<AnnouncementResponse>> CreateAsync(int userId, int petId, CreateAnnouncementModel model);
}

