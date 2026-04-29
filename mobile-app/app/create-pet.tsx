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
    },
    resolver: zodResolver(onboardingPetSchema),
  });
  const hasMicrochip: boolean = watch("hasMicrochip");

  const handleCreatePetPress = async (): Promise<void> => {
    router.back();
  };

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
      }
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#1E1E1E" />
          </TouchableOpacity>
          <Typography variant="title-medium">Add pet</Typography>
          <View className="w-11" />
        </View>
      }
    >
      <View className="p-5">
        <PetAdding control={control} hasMicrochip={hasMicrochip} />
      </View>
    </AppScreenScaffold>
  );
}
