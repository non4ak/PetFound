import React, { useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AnnouncementPreviewCard } from "@/components/announcement/AnnouncementPreviewCard";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useLostPetFlow } from "@/contexts/LostPetFlowContext";
import { getPetSexLabel, getPetSizeLabel, getPetTypeLabel } from "@/utils/petLabels";

export default function LostPetPreviewScreen() {
  const router = useRouter();
  const { details, resetDraft, selectedPet } = useLostPetFlow();

  useEffect(() => {
    if (selectedPet === null) {
      router.replace("/lost-pet");
  ***REMOVED***
***REMOVED***, [router, selectedPet]);

  if (selectedPet === null) {
    return null;
***REMOVED***

  const handlePostPress = (): void => {
    resetDraft();
    router.replace("/(tabs)");
***REMOVED***;

  const badges: string[] = [getPetTypeLabel(selectedPet.petType)];
  badges.push(selectedPet.breed);
  const sexLabel = getPetSexLabel(selectedPet.petSex);
  if (sexLabel !== null) badges.push(sexLabel);
  const sizeLabel = getPetSizeLabel(selectedPet.petSize);
  if (sizeLabel !== null) badges.push(sizeLabel);

  return (
    <AppScreenScaffold
      footer={
        <Button
          fullWidth
          label="Post"
          onPress={handlePostPress}
          size="md"
          trailingIcon={
            <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
        ***REMOVED***
          variant="primary"
        />
    ***REMOVED***
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#94A3B8" />
          </TouchableOpacity>
          <Typography
            variant="body-regular"
            className="font-semibold text-heading-text"
          >
            Preview
          </Typography>
          <TouchableOpacity onPress={handlePostPress}>
            <Typography variant="body-small" className="text-primary">
              Post
            </Typography>
          </TouchableOpacity>
        </View>
    ***REMOVED***
    >
      <Typography variant="body-small" className="text-secondary-text">
        How your post will look in the feed
      </Typography>

      <AnnouncementPreviewCard
        badges={badges}
        details={details}
        title={selectedPet.petName}
        type="lost"
      >
        <Image
          className="h-[180px] w-full rounded-[16px]"
          resizeMode="cover"
          source={{ uri: selectedPet.imageUrl }}
        />
      </AnnouncementPreviewCard>
    </AppScreenScaffold>
  );
}
