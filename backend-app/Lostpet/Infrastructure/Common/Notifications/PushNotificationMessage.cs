namespace Infrastructure.Common.Notifications;

public sealed record PushNotificationMessage(
    string DeviceKey,
    string Title,
    string Body,
    IReadOnlyDictionary<string, string> Data);
