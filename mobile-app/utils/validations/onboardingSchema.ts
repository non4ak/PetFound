import { z } from 'zod';

import {
  NotificationChannelPreference,
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from '@/types/onboarding';

const allowedUserNamePattern = /^[A-Za-z0-9\-._@+]+$/;
const phoneNumberPattern = /^\+[1-9]\d{7,14}$/;
const socialNetworkPattern = /^(@[A-Za-z0-9._-]{2,63}|https?:\/\/\S+)$/;
const chipNumberPattern = /^\d{10,20}$/;

export const onboardingProfileSchema = z.object({
  isPhonePublic: z.boolean(),
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
    .refine(
      (value: string) => value.length === 0 || socialNetworkPattern.test(value),
      'Social network must be an @handle or a valid URL',
    ),
  userName: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .regex(
      allowedUserNamePattern,
      'Username can contain only letters, numbers, and - . _ @ + symbols',
    ),
});

export const onboardingLocationSchema = z.object({
  city: z.string().trim().min(2, 'City is required'),
  country: z.string().trim().min(2, 'Country is required'),
});

export const onboardingPetSchema = z
  .object({
    breed: z.string().trim().min(2, 'Breed is required'),
    chipNumber: z
      .string()
      .trim()
      .refine(
        (value: string) => value.length === 0 || chipNumberPattern.test(value),
        'Chip number must contain 10 to 20 digits',
      ),
    description: z.string().trim().min(10, 'Description must be at least 10 characters long').optional(),
    hasMicrochip: z.boolean(),
    petAgeCategory: z.nativeEnum(OnboardingPetAgeCategory),
    petName: z.string().trim().min(2, 'Pet name is required'),
    petPhotoUrl: z
      .string()
      .trim()
      .refine(
        (value: string) => value.length === 0 || z.string().url().safeParse(value).success,
        'Pet photo URL must be a valid URL',
      ),
    petSex: z.nativeEnum(OnboardingPetSex),
    petSize: z.nativeEnum(OnboardingPetSize),
    petType: z.nativeEnum(OnboardingPetType),
***REMOVED***)
  .superRefine((data, context) => {
    if (data.hasMicrochip && data.chipNumber.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Chip number is required when microchip is enabled',
        path: ['chipNumber'],
    ***REMOVED***);
  ***REMOVED***
***REMOVED***);

export const onboardingStayInLoopSchema = z.object({
  matchFoundEnabled: z.boolean(),
  nearbyPostsEnabled: z.boolean(),
  newCommentEnabled: z.boolean(),
  notificationChannelPreference: z.nativeEnum(NotificationChannelPreference),
});

export type OnboardingProfileFormValues = z.infer<typeof onboardingProfileSchema>;
export type OnboardingLocationFormValues = z.infer<typeof onboardingLocationSchema>;
export type OnboardingPetFormValues = z.infer<typeof onboardingPetSchema>;
export type OnboardingStayInLoopFormValues = z.infer<typeof onboardingStayInLoopSchema>;
