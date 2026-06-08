namespace Infrastructure.Common.Notifications;

public sealed class PushNotificationConfigurationException : Exception
{
    public PushNotificationConfigurationException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}

public sealed class PushNotificationDeliveryException : Exception
{
    public PushNotificationDeliveryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
