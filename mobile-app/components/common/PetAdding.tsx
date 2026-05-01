import React from "react";
import { View } from "react-native";
import { type Control } from "react-hook-form";

import { ControlledPhotoUpload } from "@/components/photo/ControlledPhotoUpload";
import { ControlledInput } from "@/components/ui/ControlledInput";
import { ControlledSelectChips } from "@/components/ui/ControlledSelectChips";
import { ControlledSwitch } from "@/components/ui/ControlledSwitch";
import {
  PET_AGE_OPTIONS,
  PET_SEX_OPTIONS,
  PET_SIZE_OPTIONS,
  PET_TYPE_OPTIONS,
} from "@/constants/petOptions";
import type { OnboardingPetFormValues } from "@/utils/validations/onboardingSchema";

export interface PetAddingProps {
  control: Control<OnboardingPetFormValues>;
  hasMicrochip: boolean;
}

export function PetAdding({ control, hasMicrochip }: PetAddingProps) {
  return (
    <View className="gap-5">
      <View className="items-center">
        <ControlledPhotoUpload
          control={control}
          isOptional
          label="Add photo"
          name="petPhotoUrl"
        />
      </View>

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
        name="hasMicrochip"
        title="Has microchip"
        variant="stacked"
      >
        {hasMicrochip ? (
          <ControlledInput
            control={control}
            keyboardType="number-pad"
            label="Chip number"
            placeholder="e.g. 126634256758690"
            name="chipNumber"
          />
        ) : null}
      </ControlledSwitch>

      <ControlledInput
        className="min-h-[120px] pt-4"
        containerClassName="pb-2"
        control={control}
        isOptional
        label="Description"
        multiline
        numberOfLines={4}
        placeholder="Very active!"
        textAlignVertical="top"
        name="description"
      />
    </View>
  );
}

export default PetAdding;
