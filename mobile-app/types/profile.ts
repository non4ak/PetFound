import type { NotificationChannelPreference } from '@/types/onboarding';

export interface ProfileApiResponse {
  city?: string | null;
  country?: string | null;
  email?: string | null;
  notificationChannelPreference?: NotificationChannelPreference | null;
  phoneNumber?: string | null;
  socialNetwork?: string | null;
  userPhotoUrl?: string | null;
  userName?: string | null;
}

export interface Profile {
  city: string;
  country: string;
  email: string;
  notificationChannelPreference: NotificationChannelPreference;
  phoneNumber: string;
  socialNetwork: string;
  userPhotoUrl: string;
  userName: string;
}

export interface UpdateProfileRequest {
  phoneNumber: string;
  socialNetwork: string;
  userPhotoUrl?: string;
  country: string;
  city: string;
  notificationChannelPreference: NotificationChannelPreference;
}
