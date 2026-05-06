import apiClient from '@/api/axios-client';
import type {
  OnboardingDraft,
  SubmitOnboardingRequest,
} from '@/types/onboarding';

function createSubmitOnboardingRequest(draft: OnboardingDraft): SubmitOnboardingRequest {
  const socialNetwork: string = draft.profile.socialNetwork.trim();
  const userPhotoUrl: string = draft.profile.userPhotoUrl.trim();
  const pet = draft.pet;
  const stayInLoop = draft.stayInLoop;

  return {
    city: draft.location.city.trim(),
    country: draft.location.country.trim(),
    phoneNumber: draft.profile.phoneNumber.trim(),
    userName: draft.profile.userName.trim(),
    ...(socialNetwork.length > 0 ? { socialNetwork } : {}),
    ...(userPhotoUrl.length > 0 ? { userPhotoUrl } : {}),
    ...(stayInLoop !== null
      ? {
          notificationChannelPreference: stayInLoop.notificationChannelPreference,
      ***REMOVED***
      : {}),
    ...(pet !== null
      ? {
          breed: pet.breed.trim(),
          description: pet.description.trim(),
          petAgeCategory: pet.petAgeCategory,
          petName: pet.petName.trim(),
          petSex: pet.petSex,
          petSize: pet.petSize,
          petType: pet.petType,
          ...(pet.hasMicrochip && pet.chipNumber.trim().length > 0
            ? { chipNumber: pet.chipNumber.trim() }
            : {}),
          ...(pet.petPhotoUrl.trim().length > 0
            ? { petPhotoUrl: pet.petPhotoUrl.trim() }
            : {}),
      ***REMOVED***
      : {}),
***REMOVED***;
}

export async function submitOnboardingQuery(draft: OnboardingDraft): Promise<void> {
  const request: SubmitOnboardingRequest = createSubmitOnboardingRequest(draft);

  await apiClient.put('/users/me/onboarding', request);
}
