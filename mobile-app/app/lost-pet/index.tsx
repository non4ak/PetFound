import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Typography } from "@/components/ui/Typography";
import { useLostPetFlow } from "@/contexts/LostPetFlowContext";
import type { RegisteredPetCard } from "@/types/lost-pet";

function getPetMetaText(pet: RegisteredPetCard): string {
  const sexLabel = pet.petSex === 1 ? "Male" : pet.petSex === 2 ? "Female" : null;
  const sizeLabel =
    pet.petSize === 0 ? "Small" : pet.petSize === 1 ? "Medium" : "Large";
  return [pet.breed, sexLabel, sizeLabel].filter(Boolean).join(" · ");
}

function RegisteredPetOption({
  isSelected,
  onPress,
  pet,
}: {
  isSelected: boolean;
  onPress: () => void;
  pet: RegisteredPetCard;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View
        className={`flex-row items-center rounded-[12px] border px-4 py-4 ${
          isSelected
            ? "border-primary bg-[#FFF2D6]"
            : "border-[#BFC9D6] bg-[#EEF4FB]"
      ***REMOVED***`}
      >
        <View className="h-10 w-10 items-center justify-center rounded-[8px] border border-primary bg-[#FFF5E3]">
          <Ionicons name="paw-outline" size={18} color="#D89F35" />
        </View>

        <View className="ml-4 flex-1">
          <Typography
            variant="body-medium"
            className="font-semibold text-heading-text"
          >
            {pet.petName}
          </Typography>
          <Typography
            variant="body-small"
            className="mt-0.5 text-secondary-text"
          >
            {getPetMetaText(pet)}
          </Typography>
          <Typography
            variant="body-small"
            className={`mt-0.5 font-semibold ${
              pet.isChipped ? "text-primary" : "text-secondary-text"
          ***REMOVED***`}
          >
            {pet.isChipped ? "Chipped" : "Not chipped"}
          </Typography>
        </View>

        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#D89F35" />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function LostPetSelectPetScreen() {
  const router = useRouter();
  const { isLoadingPets, registeredPets, selectedPetId, selectPet } = useLostPetFlow();

  return (
    <AppScreenScaffold
      footer={
        <View>
          <Button
            disabled={selectedPetId === null}
            fullWidth
            label="Continue"
            onPress={() => router.push("/lost-pet/details")}
            size="md"
            trailingIcon={
              <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
          ***REMOVED***
            variant="outline"
          />
          <OnboardingProgress activeStep={1} totalSteps={3} />
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
      scrollContentClassName="pb-2"
    >
      <Stepper
        currentPage={1}
        totalPages={3}
        title="Which pet is lost?"
        subtitle="Select from your registered pets"
      />

      {isLoadingPets ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#D89F35" />
        </View>
      ) : registeredPets.length === 0 ? (
        <View className="py-8 items-center gap-2">
          <Ionicons name="paw-outline" size={40} color="#C4C4C4" />
          <Typography variant="body-small" className="text-center text-secondary-text">
            You have no registered pets yet.{"\n"}Add one below.
          </Typography>
        </View>
      ) : (
        <View className="gap-3">
          {registeredPets.map((pet: RegisteredPetCard) => (
            <RegisteredPetOption
              key={pet.id}
              isSelected={pet.id === selectedPetId}
              onPress={() => selectPet(pet.id)}
              pet={pet}
            />
          ))}
        </View>
      )}

      <View className="mt-5 border-t border-[#E5E7EB] pt-5">
        <TouchableOpacity
          activeOpacity={0.85}
          className="rounded-[18px] border border-dashed border-primary bg-white px-5 py-5"
          onPress={() => router.push("/create-pet")}
        >
          <Typography
            variant="body-medium"
            className="font-semibold text-heading-text"
          >
            + Add a new pet card
          </Typography>
        </TouchableOpacity>

        <Typography variant="body-small" className="mt-5 text-secondary-text">
          Your registered pet card is pre-filled and sent to our AI matching
          engine immediately.
        </Typography>
      </View>
    </AppScreenScaffold>
  );
}
