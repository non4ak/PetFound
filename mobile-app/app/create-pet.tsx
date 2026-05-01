import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { PetAdding } from "@/components/common/PetAdding";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
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

export default function CreatePetScreen() {
  const router = useRouter();
  const { control, handleSubmit, watch } = useForm<OnboardingPetFormValues>({
    defaultValues: {
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
  ***REMOVED***,
    resolver: zodResolver(onboardingPetSchema),
***REMOVED***);
  const hasMicrochip: boolean = watch("hasMicrochip");

  const handleCreatePetPress = async (): Promise<void> => {
    router.back();
***REMOVED***;

  return (
    <AppScreenScaffold
      footer={
        <Button
          fullWidth
          label="Create pet"
          onPress={handleSubmit(handleCreatePetPress)}
          size="lg"
          variant="primary"
        />
    ***REMOVED***
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-secondary-highlight"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#1E1E1E" />
          </TouchableOpacity>
        </View>
    ***REMOVED***
      contentClassName="py-0"
    >
      <View className="gap-2 mb-8 px-6">
        <Typography variant="title-large" className="text-heading-text">
          Your pet
        </Typography>
        <Typography variant="body-small" className="text-[#9CA3AF]">
          If your pet goes missing, we&apos;ll use this to find matches
          instantly.
        </Typography>
      </View>
      <View className="p-5">
        <PetAdding control={control} hasMicrochip={hasMicrochip} />
      </View>
    </AppScreenScaffold>
  );
}
