using Application.Meta.Interfaces;
using Domain.Extensions;
using Domain.Models.DTOS.Meta.Responses;
using Domain.Models.Enums;
using Infrastructure.Common.ResultPattern;

namespace Application.Meta.Services;

public class EnumMetadataService : IEnumMetadataService
{
    public Task<Result<EnumsResponse>> GetAllAsync()
    {
        var response = new EnumsResponse
        {
            PetTypes = MapEnum<PetType>(),
            PetSexes = MapEnum<PetSex>(),
            PetSizes = MapEnum<PetSize>(),
            PetAgeCategories = MapEnum<PetAgeCategory>(),
            AnnouncementPetStatuses = MapEnum<AnnouncementPetStatus>(),
            NotificationChannelPreferences = MapEnum<NotificationChannelPreference>(),
            NotificationTypes = MapEnum<NotificationType>(),
            MatchResultStatuses = MapEnum<MatchResultStatus>()
        };

        return Task.FromResult(Result<EnumsResponse>.Success(response));
    }

    private static List<EnumOptionResponse> MapEnum<TEnum>()
        where TEnum : struct, Enum
    {
        return Enum.GetValues<TEnum>()
            .Select(value => new EnumOptionResponse
            {
                Value = Convert.ToInt32(value),
                Name = value.ToString(),
                Label = ((Enum)(object)value).GetDisplayName()
            })
            .ToList();
    }
}

