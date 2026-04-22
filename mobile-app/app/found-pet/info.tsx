import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Switch, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/ControlledInput";
import { ControlledSelectChips } from "@/components/ui/ControlledSelectChips";
import { Stepper } from "@/components/ui/Stepper";
import { Typography } from "@/components/ui/Typography";
import {
  PET_AGE_OPTIONS,
  PET_SEX_OPTIONS,
  PET_SIZE_OPTIONS,
  PET_TYPE_OPTIONS,
} from "@/constants/petOptions";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";
import {
  foundPetInfoSchema,
  type FoundPetInfoFormValues,
} from "@/utils/validations/foundPetSchema";

export default function FoundPetInfoScreen() {
  const router = useRouter();
  const { info, updateInfo } = useFoundPetFlow();

  const {
    control,
    formState: { errors },
    handleSubmit,
***REMOVED*** = useForm<FoundPetInfoFormValues>({
    defaultValues: info,
    resolver: zodResolver(foundPetInfoSchema),
***REMOVED***);

  const handleContinue = (values: FoundPetInfoFormValues): void => {
    updateInfo({
      breed: values.breed.trim(),
      chipNumber: values.chipNumber.trim(),
      hasMicrochip: values.hasMicrochip,
      petAgeCategory: values.petAgeCategory,
      petSex: values.petSex,
      petSize: values.petSize,
      petType: values.petType,
  ***REMOVED***);
    router.push("/found-pet/details");
***REMOVED***;

  return (
    <AppScreenScaffold
      footer={
        <View>
          <Button
            fullWidth
            label="Save & Continue"
            onPress={handleSubmit(handleContinue)}
            size="md"
            trailingIcon={
              <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
          ***REMOVED***
            variant="outline"
          />
          <OnboardingProgress activeStep={2} totalSteps={4} />
        </View>
    ***REMOVED***
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#94A3B8" />
          </TouchableOpacity>
          <View className="w-10" />
        </View>
    ***REMOVED***
    >
      <Stepper
        currentPage={2}
        totalPages={4}
        title="What do you know?"
        subtitle="Everything here is optional — share only what you can."
      />

      <View className="gap-5">
        <ControlledSelectChips
          control={control}
          label="Pet type"
          name="petType"
          options={PET_TYPE_OPTIONS}
        />

        <ControlledSelectChips
          control={control}
          isOptional
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
        />

        <ControlledInput
          control={control}
          errorText={errors.breed?.message}
          label="Breed"
          name="breed"
          placeholder="e.g. Labrador"
          isOptional
        />

        <Controller
          control={control}
          name="hasMicrochip"
          render={({ field: { onChange, value } }) => (
            <View className="rounded-[12px] border border-[#BFC9D6] bg-[#EEF4FB] px-4 py-3">
              <View className="flex-row items-center justify-between gap-4">
                <Typography
                  variant="body-small"
                  className="font-semibold text-heading-text"
                >
                  Has microchip
                </Typography>
                <Switch
                  onValueChange={onChange}
                  thumbColor="#FDFDFD"
                  trackColor={{ false: "#C7C7CC", true: "#F2C94C" }}
                  value={value}
                />
              </View>
            </View>
          )}
        />

        <Controller
          control={control}
          name="hasMicrochip"
          render={({ field: { value: hasMicrochip } }) =>
            hasMicrochip ? (
              <View>
                <Typography
                  variant="body-small"
                  className="mb-1 text-primary"
                >
                  Chip number
                </Typography>
                <ControlledInput
                  control={control}
                  errorText={errors.chipNumber?.message}
                  keyboardType="numeric"
                  name="chipNumber"
                  placeholder="e.g. 1286342567568890"
                />
              </View>
            ) : (
              <View />
            )
        ***REMOVED***
        />
      </View>
    </AppScreenScaffold>
  );
}
