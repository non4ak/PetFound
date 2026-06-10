import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { PetAdding } from "@/components/common/PetAdding";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useMyPetsQuery, useUpdatePetMutation } from "@/data/hooks/pets";
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

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = Number(id);
  const router = useRouter();
  const petsQuery = useMyPetsQuery();
  const updatePetMutation = useUpdatePetMutation();

  const pet = petsQuery.data?.find((p) => p.id === petId);

  const { control, handleSubmit, watch, reset } = useForm<OnboardingPetFormValues>({
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

  useEffect(() => {
    if (pet === undefined) return;

    reset({
      breed: pet.breed ?? "",
      chipNumber: pet.chipNumber ?? "",
      description: pet.description ?? "",
      hasMicrochip: pet.chipNumber !== null && pet.chipNumber.length > 0,
      petAgeCategory: pet.petAgeCategory,
      petName: pet.petName,
      petPhotoUrl: pet.petPhotoUrl ?? "",
      petSex: pet.petSex,
      petSize: pet.petSize,
      petType: pet.petType,
    });
  }, [pet, reset]);

  const hasMicrochip = watch("hasMicrochip");

  const handleSavePress = async (values: OnboardingPetFormValues): Promise<void> => {
    await updatePetMutation.mutateAsync({
      id: petId,
      data: {
        petName: values.petName,
        petType: values.petType,
        petSex: values.petSex,
        petSize: values.petSize,
        petAgeCategory: values.petAgeCategory,
        breed: values.breed,
        ...(values.hasMicrochip && values.chipNumber.length > 0
          ? { chipNumber: values.chipNumber }
          : {}),
        ...(values.description !== undefined && values.description.trim().length > 0
          ? { description: values.description }
          : {}),
        ...(values.petPhotoUrl.trim().length > 0
          ? { petPhotoUrl: values.petPhotoUrl }
          : {}),
      },
    });
    router.back();
  };

  return (
    <AppScreenScaffold
      footer={
        <Button
          disabled={updatePetMutation.isPending}
          fullWidth
          label="Save"
          onPress={handleSubmit(handleSavePress)}
          size="lg"
          variant="primary"
        />
      }
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-secondary-highlight"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#1E1E1E" />
          </TouchableOpacity>
        </View>
      }
      contentClassName="py-0"
    >
      <View className="gap-2 mb-8 px-6">
        <Typography variant="title-large" className="text-heading-text">
          Edit pet
        </Typography>
      </View>
      <View className="p-5">
        <PetAdding control={control} hasMicrochip={hasMicrochip} />
      </View>
    </AppScreenScaffold>
  );
}
