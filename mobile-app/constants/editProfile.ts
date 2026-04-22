import { NotificationChannelPreference } from '@/types/onboarding';
import type { EditProfileFormValues } from '@/utils/validations/editProfileSchema';

export const notificationChannelOptions = [
  { label: 'Push', value: NotificationChannelPreference.Push },
  { label: 'Email', value: NotificationChannelPreference.Email },
  { label: 'Both', value: NotificationChannelPreference.Both },
] as const;

export const editProfileDefaults: EditProfileFormValues = {
  city: '',
  country: '',
  email: '',
  isMatchFoundEnabled: true,
  isNewCommentEnabled: true,
  isNearbyPostsEnabled: true,
  isPhonePublic: true,
  isSocialPublic: true,
  notificationChannel: NotificationChannelPreference.Push,
  phoneNumber: '',
  socialNetwork: '',
  userName: '',
};
