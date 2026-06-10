import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AnnouncementDetailsFormCards } from "@/components/announcement/AnnouncementDetailsFormCards";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { useLostPetFlow } from "@/contexts/LostPetFlowContext";
import {
  lostPetDetailsSchema,
  type LostPetDetailsFormValues,
} from "@/utils/validations/lostPetSchema";

export default function LostPetDetailsScreen() {
  const router = useRouter();
  const { details, selectedPet, updateDetails } = useLostPetFlow();

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
  } = useForm<LostPetDetailsFormValues>({
    defaultValues: details,
    resolver: zodResolver(lostPetDetailsSchema),
  });

  useEffect(() => {
    if (selectedPet === null) {
      router.replace("/lost-pet");
    }
  }, [router, selectedPet]);

  useEffect(() => {
    reset(details);
  }, [details, reset]);

  const saveCurrentFormValues = (): void => {
    const values: LostPetDetailsFormValues = getValues();

    updateDetails({
      city: values.city.trim(),
      country: values.country.trim(),
      dateLastSeen: values.dateLastSeen.trim(),
      description: values.description.trim(),
      lastSeenLatitude: details.lastSeenLatitude,
      lastSeenLongitude: details.lastSeenLongitude,
      showPhone: values.showPhone,
      showTelegram: values.showTelegram,
      timeApproximate: values.timeApproximate.trim(),
    });
  };

  const handleChooseLocationPress = (): void => {
    saveCurrentFormValues();
    router.push("/lost-pet/location-picker");
  };

  const handlePreviewPress = (values: LostPetDetailsFormValues): void => {
    updateDetails({
      city: values.city.trim(),
      country: values.country.trim(),
      dateLastSeen: values.dateLastSeen.trim(),
      description: values.description.trim(),
      lastSeenLatitude: details.lastSeenLatitude,
      lastSeenLongitude: details.lastSeenLongitude,
      showPhone: values.showPhone,
      showTelegram: values.showTelegram,
      timeApproximate: values.timeApproximate.trim(),
    });
    router.push("/lost-pet/preview");
  };

  return (
    <AppScreenScaffold
      footer={
        <View>
          <Button
            fullWidth
            label="Preview post"
            onPress={handleSubmit(handlePreviewPress)}
            size="md"
            trailingIcon={
              <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
            }
            variant="primary"
          />
          <OnboardingProgress activeStep={2} totalSteps={3} />
        </View>
      }
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
      }
    >
      <Stepper
        currentPage={2}
        totalPages={3}
        title="Where & when?"
        subtitle="Tell us where you last saw your pet."
      />

      <AnnouncementDetailsFormCards
        control={control}
        errors={errors}
        onChooseLocationPress={handleChooseLocationPress}
      />
    </AppScreenScaffold>
  );
}
