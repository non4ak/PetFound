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
  petId?: number;
  petName?: string;
  petPhotoUrl?: string;
  petSex?: OnboardingPetSex;
  petSize?: OnboardingPetSize;
  petStatus: AnnouncementPetStatus;
  petType?: OnboardingPetType;
}

export interface AnnouncementResponse {
  message: string;
  data: {
    id: number;
    petId: number;
    petStatus: number;
    petStatusLabel: string;
    country: string;
    city: string;
    lastDateWhenSeen: string;
    approximateTime: string;
    petDetails: string;
    isPhonePublic: boolean;
    isTelegramActive: boolean;
    nearLandmark: string;
    lastSeenLatitude: number;
    lastSeenLongitude: number;
    isActive: boolean;
    createdOn: string;
    pet: {
      id: number;
      petName: string;
      petType: number;
      petTypeLabel: string;
      petSex: number;
      petSexLabel: string;
      petSize: number;
      petSizeLabel: string;
      petAgeCategory: number;
      petAgeCategoryLabel: string;
      breed: string;
      chipNumber: string;
      description: string;
      petPhotoUrl: string;
    }
  }
}

export type AnnouncementQueryFilter = {
  search?: string;
  petStatus?: number;
  petType?: number;
  city?: string;
  country?: string;
  createdFrom?: string;
  createdTo?: string;
  isActive?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};

export type Announcement = {
  id: number;
  petId: number;
  petStatus: number;
  petStatusLabel: string;
  petName: string;
  petType: number;
  petTypeLabel: string;
  breed: string | null;
  petSex: number;
  petSexLabel: string;
  petSize: number;
  petSizeLabel: string;
  petPhotoUrl: string | null;
  country: string;
  city: string;
  nearLandmark: string;
  lastDateWhenSeen: string;
  approximateTime: string;
  petDetails: string;
  isPhonePublic: boolean;
  isTelegramActive: boolean;
  lastSeenLatitude: number;
  lastSeenLongitude: number;
  isActive: boolean;
  createdOn: string;
  commentsCount: number;
}

export type AnnouncementQueryFilterResponse = {
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    items: Announcement[]
  }
}