import { axiosClient } from '@/api/axios-client';
import type { ApiResponse } from '@/types/auth';
import { NotificationChannelPreference } from '@/types/onboarding';
import type { Profile, ProfileApiResponse, UpdateProfileRequest } from '@/types/profile';

function mapProfile(response: ProfileApiResponse): Profile {
  return {
    city: response.city ?? '',
    country: response.country ?? '',
    email: response.email ?? '',
    notificationChannelPreference:
      response.notificationChannelPreference ?? NotificationChannelPreference.Push,
    phoneNumber: response.phoneNumber ?? '',
    socialNetwork: response.socialNetwork ?? '',
    userPhotoUrl: response.userPhotoUrl ?? '',
    userName: response.userName ?? '',
***REMOVED***;
}

export async function getProfileQuery(): Promise<Profile> {
  const response = await axiosClient.get<ApiResponse<ProfileApiResponse>>('/Auth/profile');

  return mapProfile(response.data.data);
}

export async function updateProfileQuery(request: UpdateProfileRequest): Promise<void> {
  await axiosClient.put('/Auth/profile', request);
}
