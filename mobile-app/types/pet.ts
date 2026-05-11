import type {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from '@/types/onboarding';

export interface Pet {
  id: number;
  petName: string;
  petType: OnboardingPetType;
  petTypeLabel: string;
  petSex: OnboardingPetSex;
  petSexLabel: string;
  petSize: OnboardingPetSize;
  petSizeLabel: string;
  petAgeCategory: OnboardingPetAgeCategory;
  petAgeCategoryLabel: string;
  breed: string | null;
  chipNumber: string | null;
  description: string | null;
  petPhotoUrl: string | null;
  createdOn: string;
}

export interface CreatePetRequest {
  petName: string;
  petType: OnboardingPetType;
  petSex: OnboardingPetSex;
  petSize: OnboardingPetSize;
  petAgeCategory: OnboardingPetAgeCategory;
  breed: string;
  chipNumber?: string;
  description?: string;
  petPhotoUrl?: string;
}
