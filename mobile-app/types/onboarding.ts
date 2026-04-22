export enum NotificationChannelPreference {
  Push = 0,
  Email = 1,
  Both = 2,
}

export enum OnboardingPetType {
  Dog = 0,
  Cat = 1,
  Other = 2,
}

export enum OnboardingPetSex {
  Male = 0,
  Female = 1,
}

export enum OnboardingPetSize {
  Small = 0,
  Medium = 1,
  Large = 2,
}

export enum OnboardingPetAgeCategory {
  Young = 0,
  Adult = 1,
  Senior = 2,
}

export interface UpdateOnboardingProfileRequest {
  userName: string;
  phoneNumber: string;
  socialNetwork?: string;
}

export interface UpdateOnboardingLocationRequest {
  country: string;
  city: string;
}

export interface UpdateOnboardingNotificationRequest {
  notificationChannelPreference: NotificationChannelPreference;
}

export interface UpdateOnboardingPetRequest {
  petName: string;
  petType: OnboardingPetType;
  petSex: OnboardingPetSex;
  petSize: OnboardingPetSize;
  petAgeCategory: OnboardingPetAgeCategory;
  breed: string;
  chipNumber?: string;
  description: string;
  petPhotoUrl?: string;
}

export type UpdateOnboardingRequest =
  | UpdateOnboardingProfileRequest
  | UpdateOnboardingLocationRequest
  | UpdateOnboardingNotificationRequest
  | UpdateOnboardingPetRequest;

export interface SubmitOnboardingRequest {
  city: string;
  country: string;
  phoneNumber: string;
  userName: string;
  socialNetwork?: string;
  notificationChannelPreference?: NotificationChannelPreference;
  petName?: string;
  petType?: OnboardingPetType;
  petSex?: OnboardingPetSex;
  petSize?: OnboardingPetSize;
  petAgeCategory?: OnboardingPetAgeCategory;
  breed?: string;
  chipNumber?: string;
  description?: string;
  petPhotoUrl?: string;
}

export interface OnboardingProfileStepData {
  isPhonePublic: boolean;
  phoneNumber: string;
  socialNetwork: string;
  userName: string;
}

export interface OnboardingLocationStepData {
  city: string;
  country: string;
}

export interface OnboardingPetStepData {
  breed: string;
  chipNumber: string;
  description: string;
  hasMicrochip: boolean;
  petAgeCategory: OnboardingPetAgeCategory;
  petName: string;
  petPhotoUrl: string;
  petSex: OnboardingPetSex;
  petSize: OnboardingPetSize;
  petType: OnboardingPetType;
}

export interface OnboardingStayInLoopStepData {
  matchFoundEnabled: boolean;
  nearbyPostsEnabled: boolean;
  newCommentEnabled: boolean;
  notificationChannelPreference: NotificationChannelPreference;
}

export interface OnboardingDraft {
  location: OnboardingLocationStepData;
  pet: OnboardingPetStepData | null;
  profile: OnboardingProfileStepData;
  stayInLoop: OnboardingStayInLoopStepData | null;
}
