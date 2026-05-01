namespace Domain.Models.DTOS.Meta.Responses;

public class EnumsResponse
{
    public List<EnumOptionResponse> PetTypes { get; set; } = new();

    public List<EnumOptionResponse> PetSexes { get; set; } = new();

    public List<EnumOptionResponse> PetSizes { get; set; } = new();

    public List<EnumOptionResponse> PetAgeCategories { get; set; } = new();

    public List<EnumOptionResponse> AnnouncementPetStatuses { get; set; } = new();

    public List<EnumOptionResponse> NotificationChannelPreferences { get; set; } = new();

    public List<EnumOptionResponse> NotificationTypes { get; set; } = new();

    public List<EnumOptionResponse> MatchResultStatuses { get; set; } = new();
}

public class EnumOptionResponse
{
    public int Value { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;
}

