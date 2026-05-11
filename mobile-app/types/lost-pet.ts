import type { AnnouncementDetails } from "@/types/announcement";
import type {
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";

export type LostPetDetails = AnnouncementDetails;

export interface RegisteredPetCard {
  breed: string;
  id: number;
  imageUrl: string;
  isChipped: boolean;
  petName: string;
  petSex: OnboardingPetSex;
  petSize: OnboardingPetSize;
  petType: OnboardingPetType;
}

export interface LostPetDraft {
  details: LostPetDetails;
  selectedPetId: number | null;
}
