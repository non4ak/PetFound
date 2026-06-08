namespace Infrastructure.Common.Notifications;

public interface IPushNotificationSender
{
    Task<PushNotificationSendResult> SendAsync(
        PushNotificationMessage notification,
        CancellationToken cancellationToken);
}
