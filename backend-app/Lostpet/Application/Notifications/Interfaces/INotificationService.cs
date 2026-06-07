using Domain.Models.DTOS.Matches.Responses;
using Domain.Models.DTOS.Notifications.Responses;
using Domain.Models.Enums;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.Notifications.Interfaces;

public interface INotificationService
{
    Task<Result<IPagedList<NotificationResponse>>> GetMyPagedAsync(int userId, int pageNumber, int pageSize, bool? unreadOnly);

    Task<Result<IPagedList<MatchResultResponse>>> GetMyMatchesAsync(int userId, int pageNumber, int pageSize, MatchResultStatus? status);

    Task<Result<bool>> MarkAsReadAsync(int userId, int notificationId);

    Task<Result<bool>> ApproveMatchAsync(int userId, int matchResultId);

    Task<Result<bool>> RejectMatchAsync(int userId, int matchResultId);
}
