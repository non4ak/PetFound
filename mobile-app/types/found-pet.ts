import type { AnnouncementDetails } from "@/types/announcement";
import type {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";

export type FoundPetDetails = AnnouncementDetails;

export interface FoundPetInfo {
  breed: string;
  chipNumber: string;
  hasMicrochip: boolean;
  petAgeCategory: OnboardingPetAgeCategory | null;
  petSex: OnboardingPetSex | null;
  petSize: OnboardingPetSize | null;
  petType: OnboardingPetType | null;
}

export interface FoundPetDraft {
  details: FoundPetDetails;
  info: FoundPetInfo;
  photoUri: string | null;
}
