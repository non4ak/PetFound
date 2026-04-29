import React, { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";

import { PetAdding } from "@/components/common/PetAdding";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingScaffold } from "@/components/onboarding/OnboardingScaffold";
import { Stepper } from "@/components/ui/Stepper";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
  type OnboardingPetStepData,
} from "@/types/onboarding";
import {
  onboardingPetSchema,
  type OnboardingPetFormValues,
} from "@/utils/validations/onboardingSchema";

function createPetDefaultValues(): OnboardingPetFormValues {
  return {
    breed: "",
    chipNumber: "",
    description: "",
    hasMicrochip: false,
    petAgeCategory: OnboardingPetAgeCategory.Adult,
    petName: "",
    petPhotoUrl: "",
    petSex: OnboardingPetSex.Male,
    petSize: OnboardingPetSize.Medium,
    petType: OnboardingPetType.Dog,
  };
}

function createPetStepData(values: OnboardingPetFormValues): OnboardingPetStepData {
  return {
    ...values,
    description: values.description ?? "",
  };
}

export default function PetOnboardingScreen() {
  const { clearPetStep, onboardingDraft, savePetStep } = useOnboarding();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    watch,
  } = useForm<OnboardingPetFormValues>({
    defaultValues: onboardingDraft.pet ?? createPetDefaultValues(),
    resolver: zodResolver(onboardingPetSchema),
  });
  const hasMicrochip: boolean = watch("hasMicrochip");

  const handleContinuePress = async (
    values: OnboardingPetFormValues,
  ): Promise<void> => {
    savePetStep(createPetStepData(values));

    startTransition(() => {
      router.push("./stay-in-loop");
    });
  };

  const handleBackPress = (): void => {
    savePetStep(createPetStepData(getValues()));
    router.back();
  };

  const handleSkipPress = (): void => {
    clearPetStep();

    startTransition(() => {
      router.replace("./stay-in-loop");
    });
  };

  return (
    <OnboardingScaffold
      onBackPress={handleBackPress}
      onPrimaryActionPress={handleSubmit(handleContinuePress)}
      primaryActionErrorText={errors.root?.message}
      onTopActionPress={handleSkipPress}
      primaryActionLabel="Save & Continue"
      topActionLabel="Skip for now"
      bottomContent={<OnboardingProgress activeStep={3} totalSteps={4} />}
      primaryActionButtonVariant="outline"
    >
      <Stepper
        currentPage={3}
        totalPages={4}
        title="Add your pet"
        subtitle="Add your pet now or skip and return to this later."
        isOptional
      />
      <PetAdding control={control} hasMicrochip={hasMicrochip} />
    </OnboardingScaffold>
  );
}
