using System.ComponentModel.DataAnnotations;

namespace Domain.Models.DTOS.Auth.Models;

public class UpdateDeviceKeyModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(4096)]
    public string DeviceKey { get; set; } = string.Empty;
}
