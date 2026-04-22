import {
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";

export function getPetTypeLabel(petType: OnboardingPetType | null): string {
  switch (petType) {
    case OnboardingPetType.Dog:
      return "Dog";
    case OnboardingPetType.Cat:
      return "Cat";
    case OnboardingPetType.Other:
      return "Other";
    default:
      return "Unknown";
  }
}

export function getPetSexLabel(sex: OnboardingPetSex | null): string | null {
  switch (sex) {
    case OnboardingPetSex.Male:
      return "Male";
    case OnboardingPetSex.Female:
      return "Female";
    default:
      return null;
  }
}

export function getPetSizeLabel(size: OnboardingPetSize | null): string | null {
  switch (size) {
    case OnboardingPetSize.Small:
      return "Small";
    case OnboardingPetSize.Medium:
      return "Medium";
    case OnboardingPetSize.Large:
      return "Large";
    default:
      return null;
  }
}
