using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Common.Notifications;

public sealed class FirebasePushNotificationSender : IPushNotificationSender
{
    private readonly FirebasePushNotificationConfig _config;
    private readonly ILogger<FirebasePushNotificationSender> _logger;
    private readonly Lazy<FirebaseMessaging> _messaging;

    public FirebasePushNotificationSender(
        IOptions<FirebasePushNotificationConfig> config,
        ILogger<FirebasePushNotificationSender> logger)
    {
        _config = config.Value;
        _logger = logger;
        _messaging = new Lazy<FirebaseMessaging>(
            CreateMessaging,
            LazyThreadSafetyMode.ExecutionAndPublication);
    }

    public async Task<PushNotificationSendResult> SendAsync(
        PushNotificationMessage notification,
        CancellationToken cancellationToken)
    {
        ValidateNotification(notification);

        var message = new Message
        {
            Token = notification.DeviceKey,
            Notification = new FirebaseAdmin.Messaging.Notification
            {
                Title = notification.Title,
                Body = notification.Body
            },
            Data = new Dictionary<string, string>(notification.Data),
            Android = new AndroidConfig
            {
                Priority = Priority.High
            }
        };

        var maxAttempts = Math.Max(1, _config.MaxRetries);
        Exception? lastError = null;

        for (var attemptNumber = 1; attemptNumber <= maxAttempts; attemptNumber++)
        {
            try
            {
                await _messaging.Value.SendAsync(message, cancellationToken);
                return PushNotificationSendResult.Sent;
            }
            catch (FirebaseMessagingException ex)
                when (ex.MessagingErrorCode == MessagingErrorCode.Unregistered)
            {
                _logger.LogWarning(
                    ex,
                    "Firebase rejected an unregistered device key. DeviceKeyLength: {DeviceKeyLength}",
                    notification.DeviceKey.Length);
                return PushNotificationSendResult.InvalidDeviceKey;
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (PushNotificationConfigurationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                lastError = ex;
                _logger.LogWarning(
                    ex,
                    "Firebase push delivery attempt failed. Attempt: {AttemptNumber}, MaxAttempts: {MaxAttempts}, DeviceKeyLength: {DeviceKeyLength}, Data: {@Data}",
                    attemptNumber,
                    maxAttempts,
                    notification.DeviceKey.Length,
                    notification.Data);

                if (attemptNumber < maxAttempts)
                {
                    var retryDelay = TimeSpan.FromMilliseconds(
                        Math.Max(0, _config.RetryDelayMilliseconds));
                    await Task.Delay(retryDelay, cancellationToken);
                }
            }
        }

        throw new PushNotificationDeliveryException(
            $"Firebase push delivery failed after {maxAttempts} attempts.",
            lastError ?? new InvalidOperationException("Firebase push delivery failed without an exception."));
    }

    private FirebaseMessaging CreateMessaging()
    {
        try
        {
            var credential = CreateCredential();
            var options = new AppOptions
            {
                Credential = credential
            };

            if (!string.IsNullOrWhiteSpace(_config.ProjectId))
            {
                options.ProjectId = _config.ProjectId.Trim();
            }

            var app = FirebaseApp.Create(options);
            return FirebaseMessaging.GetMessaging(app);
        }
        catch (Exception ex)
        {
            throw new PushNotificationConfigurationException(
                "Firebase Admin initialization failed. Configure Firebase:CredentialsPath, Firebase:CredentialsJson, or GOOGLE_APPLICATION_CREDENTIALS.",
                ex);
        }
    }

    private GoogleCredential CreateCredential()
    {
        if (!string.IsNullOrWhiteSpace(_config.CredentialsJson))
        {
            return CredentialFactory
                .FromJson<ServiceAccountCredential>(_config.CredentialsJson)
                .ToGoogleCredential();
        }

        if (!string.IsNullOrWhiteSpace(_config.CredentialsPath))
        {
            return CredentialFactory
                .FromFile<ServiceAccountCredential>(_config.CredentialsPath)
                .ToGoogleCredential();
        }

        return GoogleCredential.GetApplicationDefault();
    }

    private static void ValidateNotification(PushNotificationMessage notification)
    {
        if (string.IsNullOrWhiteSpace(notification.DeviceKey))
        {
            throw new ArgumentException("Push notification device key is required.", nameof(notification));
        }

        if (string.IsNullOrWhiteSpace(notification.Title))
        {
            throw new ArgumentException("Push notification title is required.", nameof(notification));
        }

        if (string.IsNullOrWhiteSpace(notification.Body))
        {
            throw new ArgumentException("Push notification body is required.", nameof(notification));
        }
    }
}
