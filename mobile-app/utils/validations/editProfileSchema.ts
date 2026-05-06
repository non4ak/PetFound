import { z } from 'zod';

import { NotificationChannelPreference } from '@/types/onboarding';

const phoneNumberPattern = /^\+[1-9]\d{7,14}$/;
const socialNetworkPattern = /^(@[A-Za-z0-9._-]{2,63}|https?:\/\/\S+)$/;

export const editProfileSchema = z.object({
  city: z.string().trim().min(2, 'City is required'),
  country: z.string().trim().min(2, 'Country is required'),
  email: z.string().email(),
  isMatchFoundEnabled: z.boolean(),
  isNewCommentEnabled: z.boolean(),
  isNearbyPostsEnabled: z.boolean(),
  isPhonePublic: z.boolean(),
  isSocialPublic: z.boolean(),
  notificationChannel: z.nativeEnum(NotificationChannelPreference),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(
      phoneNumberPattern,
      'Phone number must be in international format, for example +15551234567',
    ),
  socialNetwork: z
    .string()
    .trim()
    .min(1, 'Social media link is required')
    .refine(
      (value: string) => socialNetworkPattern.test(value),
      'Social media link must be an @handle or a valid URL',
    ),
  userPhotoUrl: z
    .string()
    .trim()
    .refine(
      (value: string) => value.length === 0 || z.string().url().safeParse(value).success,
      'Profile photo URL must be a valid URL',
    ),
  userName: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long'),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
