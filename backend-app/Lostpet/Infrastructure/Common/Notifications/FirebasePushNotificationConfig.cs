namespace Infrastructure.Common.Notifications;

public class FirebasePushNotificationConfig
{
    public string ProjectId { get; set; } = string.Empty;

    public string CredentialsPath { get; set; } = string.Empty;

    public string CredentialsJson { get; set; } = string.Empty;

    public int MaxRetries { get; set; } = 3;

    public int RetryDelayMilliseconds { get; set; } = 1000;
}
