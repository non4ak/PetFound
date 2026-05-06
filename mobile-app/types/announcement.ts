import type {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";

export type AnnouncementType = "lost" | "found";

export interface AnnouncementDetails {
  city: string;
  country: string;
  dateLastSeen: string;
  description: string;
  showPhone: boolean;
  showTelegram: boolean;
  timeApproximate: string;
}

export enum AnnouncementPetStatus {
  Lost = 0,
  Found = 1,
}

export interface CreateAnnouncementRequest {
  approximateTime: string;
  breed?: string;
  chipNumber?: string;
  city: string;
  country: string;
  isPhonePublic: boolean;
  isTelegramActive: boolean;
  lastDateWhenSeen: string;
  nearLandmark: string;
  petAgeCategory?: OnboardingPetAgeCategory;
  petDetails: string;
  petName?: string;
  petPhotoUrl?: string;
  petSex?: OnboardingPetSex;
  petSize?: OnboardingPetSize;
  petStatus: AnnouncementPetStatus;
  petType?: OnboardingPetType;
}

export interface AnnouncementResponse {
  city?: string;
  country?: string;
  createdOn: string;
  id: number;
  isActive: boolean;
  lastSeenLatitude?: number;
  lastSeenLongitude?: number;
  petId: number;
  petPhotoUrl?: string;
  petStatus: AnnouncementPetStatus;
  petStatusLabel: string;
  petType: OnboardingPetType;
  petTypeLabel: string;
}
