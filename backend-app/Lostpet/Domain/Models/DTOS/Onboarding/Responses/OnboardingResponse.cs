namespace Domain.Models.DTOS.Onboarding.Responses;

public class OnboardingResponse
{
    public int UserId { get; set; }

    public bool IsOnboardingCompleted { get; set; }

    public int? PetId { get; set; }
}

