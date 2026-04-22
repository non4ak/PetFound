using Domain.Models.DTOS.Onboarding.Models;
using Domain.Models.DTOS.Onboarding.Responses;
using Infrastructure.Common.ResultPattern;

namespace Application.Onboarding.Interfaces;

public interface IOnboardingService
{
    Task<Result<OnboardingResponse>> CompleteAsync(int userId, CompleteOnboardingModel model);
}

