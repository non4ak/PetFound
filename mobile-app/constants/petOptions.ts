import {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";

import type { SelectChipOption } from "@/components/ui/ControlledSelectChips";

export const PET_TYPE_OPTIONS: readonly SelectChipOption<OnboardingPetType>[] = [
  { label: "Dog", value: OnboardingPetType.Dog },
  { label: "Cat", value: OnboardingPetType.Cat },
  { label: "Other", value: OnboardingPetType.Other },
];

export const PET_SEX_OPTIONS: readonly SelectChipOption<OnboardingPetSex>[] = [
  { label: "Male", value: OnboardingPetSex.Male },
  { label: "Female", value: OnboardingPetSex.Female },
];

export const PET_SIZE_OPTIONS: readonly SelectChipOption<OnboardingPetSize>[] = [
  { label: "Small", value: OnboardingPetSize.Small },
  { label: "Medium", value: OnboardingPetSize.Medium },
  { label: "Large", value: OnboardingPetSize.Large },
];

export const PET_AGE_OPTIONS: readonly SelectChipOption<OnboardingPetAgeCategory>[] = [
  { label: "Young", value: OnboardingPetAgeCategory.Young },
  { label: "Adult", value: OnboardingPetAgeCategory.Adult },
  { label: "Senior", value: OnboardingPetAgeCategory.Senior },
];
