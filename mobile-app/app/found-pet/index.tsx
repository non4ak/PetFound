import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Typography } from "@/components/ui/Typography";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";

export default function FoundPetPhotoScreen() {
  const router = useRouter();
  const { photoUri } = useFoundPetFlow();

  const handleTakePhoto = (): void => {
    // TODO: integrate with image picker
  };

  return (
    <AppScreenScaffold
      footer={
        <View>
          <Button
            fullWidth
            label="Continue"
            onPress={() => router.push("/found-pet/info")}
            size="md"
            trailingIcon={
              <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
            }
            variant="outline"
          />
          <OnboardingProgress activeStep={1} totalSteps={4} />
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
      scrollContentClassName="pb-2"
    >
      <Stepper
        currentPage={1}
        totalPages={4}
        title="Add a pet"
        subtitle="A photo is the most important thing. Owners recognise their pet instantly."
      />

      <TouchableOpacity
        activeOpacity={0.85}
        className="items-center justify-center rounded-[24px] border-2 border-dashed border-primary bg-[#FFF7EA] px-6 py-16"
        onPress={handleTakePhoto}
      >
        {photoUri ? (
          <Ionicons name="checkmark-circle" size={48} color="#D89F35" />
        ) : (
          <>
            <Ionicons name="camera-outline" size={40} color="#D89F35" />
            <Typography
              variant="body-medium"
              className="mt-4 font-semibold text-heading-text"
            >
              Take or upload photo
            </Typography>
          </>
        )}
      </TouchableOpacity>

      <Typography
        variant="body-small"
        className="mt-5 text-secondary-text"
      >
        Even a blurry photo helps. Our AI uses image recognition to find
        matches between posts.
      </Typography>
    </AppScreenScaffold>
  );
}
