import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useDeletePetMutation, useMyPetsQuery } from "@/data/hooks/pets";

export default function ViewPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = Number(id);
  const router = useRouter();
  const petsQuery = useMyPetsQuery();
  const deletePetMutation = useDeletePetMutation();

  const pet = petsQuery.data?.find((p) => p.id === petId);

  const handleDeletePress = (): void => {
    Alert.alert(
      "Delete pet",
      `Are you sure you want to delete ${pet?.petName ?? "this pet"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deletePetMutation.mutateAsync(petId);
            router.back();
        ***REMOVED***,
      ***REMOVED***,
      ],
    );
***REMOVED***;

  const chips: string[] = pet
    ? [
        pet.petTypeLabel,
        ...(pet.breed !== null && pet.breed.length > 0 ? [pet.breed] : []),
        pet.petSexLabel,
        pet.petSizeLabel,
        pet.petAgeCategoryLabel,
      ]
    : [];

  return (
    <AppScreenScaffold
      contentClassName="bg-background"
      scrollContentClassName="pb-10 px-4"
    >
      {pet !== undefined && (
        <View className="rounded-2xl bg-white shadow-sm overflow-hidden">
          {pet.petPhotoUrl !== null && pet.petPhotoUrl.length > 0 ? (
            <Image
              source={{ uri: pet.petPhotoUrl }}
              style={{ width: "100%", height: 230 }}
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-[160px] items-center justify-center bg-secondary-highlight">
              <Ionicons name="paw-outline" size={48} color="#D89F35" />
            </View>
          )}

          <View className="p-5">
            <Typography
              variant="title-medium"
              className="font-semibold text-heading-text mb-4"
            >
              {pet.petName}
            </Typography>

            <View className="flex-row flex-wrap gap-2 mb-4">
              {chips.map((chip) => (
                <View
                  key={chip}
                  className="rounded-full border border-secondary-text bg-secondary-highlight px-3 py-1"
                >
                  <Typography
                    variant="body-small"
                    className="font-medium text-heading-text"
                  >
                    {chip}
                  </Typography>
                </View>
              ))}
            </View>

            {pet.chipNumber !== null && pet.chipNumber.length > 0 && (
              <View className="rounded-lg bg-[#D3FFF5] px-4 py-3 mb-4">
                <Typography
                  variant="body-small"
                  className="font-bold text-primary mb-1"
                >
                  Chipped
                </Typography>
                <Typography variant="body-small" className="text-paragraph-text">
                  {pet.chipNumber}
                </Typography>
              </View>
            )}

            {pet.description !== null && pet.description.length > 0 && (
              <>
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="flex-1 h-px bg-[#E0E0E0]" />
                  <Typography
                    variant="body-small"
                    className="text-secondary-text"
                  >
                    pet details
                  </Typography>
                  <View className="flex-1 h-px bg-[#E0E0E0]" />
                </View>
                <Typography variant="body-small" className="text-paragraph-text">
                  {pet.description}
                </Typography>
              </>
            )}
          </View>
        </View>
      )}

      <View className="mt-6 gap-3">
        <Button
          fullWidth
          label="Edit"
          onPress={() => router.push(`/edit-pet/${petId}`)}
          size="lg"
          variant="outline"
        />
        <TouchableOpacity
          className="items-center py-3"
          disabled={deletePetMutation.isPending}
          onPress={handleDeletePress}
        >
          <Typography
            variant="body-regular"
            className="font-medium text-[#DE0000]"
          >
            Delete
          </Typography>
        </TouchableOpacity>
      </View>
    </AppScreenScaffold>
  );
}
