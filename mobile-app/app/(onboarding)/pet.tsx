import React, { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { useRouter } from "expo-router";

import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingScaffold } from "@/components/onboarding/OnboardingScaffold";
import { ControlledInput } from "@/components/ui/ControlledInput";
import {
  ControlledSelectChips,
  type SelectChipOption,
} from "@/components/ui/ControlledSelectChips";
import { ControlledSwitch } from "@/components/ui/ControlledSwitch";
import { Stepper } from "@/components/ui/Stepper";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";
import {
  onboardingPetSchema,
  type OnboardingPetFormValues,
} from "@/utils/validations/onboardingSchema";

const PET_TYPE_OPTIONS: readonly SelectChipOption<OnboardingPetType>[] = [
  { label: "Dog", value: OnboardingPetType.Dog },
  { label: "Cat", value: OnboardingPetType.Cat },
  { label: "Other", value: OnboardingPetType.Other },
];

const PET_SEX_OPTIONS: readonly SelectChipOption<OnboardingPetSex>[] = [
  { label: "Male", value: OnboardingPetSex.Male },
  { label: "Female", value: OnboardingPetSex.Female },
];

const PET_SIZE_OPTIONS: readonly SelectChipOption<OnboardingPetSize>[] = [
  { label: "Small", value: OnboardingPetSize.Small },
  { label: "Medium", value: OnboardingPetSize.Medium },
  { label: "Large", value: OnboardingPetSize.Large },
];

const PET_AGE_OPTIONS: readonly SelectChipOption<OnboardingPetAgeCategory>[] = [
  { label: "Young", value: OnboardingPetAgeCategory.Young },
  { label: "Adult", value: OnboardingPetAgeCategory.Adult },
  { label: "Senior", value: OnboardingPetAgeCategory.Senior },
];

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
***REMOVED***;
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
***REMOVED*** = useForm<OnboardingPetFormValues>({
    defaultValues: onboardingDraft.pet ?? createPetDefaultValues(),
    resolver: zodResolver(onboardingPetSchema),
***REMOVED***);
  const hasMicrochip: boolean = watch("hasMicrochip");

  const handleContinuePress = async (
    values: OnboardingPetFormValues,
  ): Promise<void> => {
    savePetStep(values);

    startTransition(() => {
      router.push("./stay-in-loop");
  ***REMOVED***);
***REMOVED***;

  const handleBackPress = (): void => {
    savePetStep(getValues());
    router.back();
***REMOVED***;

  const handleSkipPress = (): void => {
    clearPetStep();

    startTransition(() => {
      router.replace("./stay-in-loop");
  ***REMOVED***);
***REMOVED***;

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
      <View className="gap-7">
        <ControlledInput
          control={control}
          label="Pet name"
          placeholder="e.g. Buddy"
          name="petName"
        />

        <ControlledSelectChips
          control={control}
          label="Pet type"
          name="petType"
          options={PET_TYPE_OPTIONS}
        />

        <ControlledSelectChips
          control={control}
          label="Sex"
          name="petSex"
          options={PET_SEX_OPTIONS}
        />

        <ControlledSelectChips
          control={control}
          label="Size"
          name="petSize"
          options={PET_SIZE_OPTIONS}
        />

        <ControlledSelectChips
          control={control}
          label="Age"
          name="petAgeCategory"
          options={PET_AGE_OPTIONS}
          isOptional
        />

        <ControlledInput
          control={control}
          label="Breed"
          placeholder="e.g. Labrador"
          name="breed"
        />

        <ControlledSwitch
          control={control}
          description="Turn this on if you want to save a chip number now."
          name="hasMicrochip"
          title="Has microchip"
        >
          {hasMicrochip && (
            <ControlledInput
              control={control}
              keyboardType="number-pad"
              label="Chip number"
              placeholder="985112003456789"
              name="chipNumber"
            />
          )}
        </ControlledSwitch>

        <ControlledInput
          autoCapitalize="none"
          autoCorrect={false}
          control={control}
          keyboardType="url"
          label="Pet photo URL"
          placeholder="https://example.com/pet.jpg"
          name="petPhotoUrl"
        />

        <ControlledInput
          className="min-h-[120px] pt-4"
          containerClassName="pb-2"
          control={control}
          isOptional
          label="Description"
          multiline
          numberOfLines={4}
          placeholder="Very active, loves the park, responds to whistles."
          textAlignVertical="top"
          name="description"
        />
      </View>
    </OnboardingScaffold>
  );
}
