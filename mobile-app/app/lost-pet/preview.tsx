import React, { useEffect, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";

import { AnnouncementPreviewCard } from "@/components/announcement/AnnouncementPreviewCard";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useLostPetFlow } from "@/contexts/LostPetFlowContext";
import { createAnnouncementQuery } from "@/data/queries/announcements";
import {
  AnnouncementPetStatus,
  type CreateAnnouncementRequest,
} from "@/types/announcement";
import { toAnnouncementDateTimeOffset } from "@/utils/announcementDate";
import { getApiErrorMessage } from "@/utils/apiError";
import { getPetSexLabel, getPetSizeLabel, getPetTypeLabel } from "@/utils/petLabels";

export default function LostPetPreviewScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { details, resetDraft, selectedPet } = useLostPetFlow();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPet === null) {
      router.replace("/lost-pet");
  ***REMOVED***
***REMOVED***, [router, selectedPet]);

  if (selectedPet === null) {
    return null;
***REMOVED***

  const handlePostPress = async (): Promise<void> => {
    if (selectedPet === null) {
      return;
  ***REMOVED***

    setIsPosting(true);

    try {
      const request: CreateAnnouncementRequest = {
        petId: selectedPet.id,
        petStatus: AnnouncementPetStatus.Lost,
        approximateTime: details.timeApproximate.trim().length > 0
          ? details.timeApproximate.trim()
          : "Unknown",
        city: details.city.trim(),
        country: details.country.trim(),
        isPhonePublic: details.showPhone,
        isTelegramActive: details.showTelegram,
        lastDateWhenSeen: toAnnouncementDateTimeOffset(details.dateLastSeen),
        nearLandmark: details.city.trim(),
        petDetails: details.description.trim().length > 0
          ? details.description.trim()
          : "No additional details provided.",
    ***REMOVED***;

      await createAnnouncementQuery(request);
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
      resetDraft();
      router.replace("/(tabs)");
  ***REMOVED*** catch (error: unknown) {
      Alert.alert(
        "Post failed",
        getApiErrorMessage(error, "Could not create announcement."),
      );
  ***REMOVED*** finally {
      setIsPosting(false);
  ***REMOVED***
***REMOVED***;

  const badges: string[] = [getPetTypeLabel(selectedPet.petType)];
  if (selectedPet.breed.trim().length > 0) badges.push(selectedPet.breed);
  const sexLabel = getPetSexLabel(selectedPet.petSex);
  if (sexLabel !== null) badges.push(sexLabel);
  const sizeLabel = getPetSizeLabel(selectedPet.petSize);
  if (sizeLabel !== null) badges.push(sizeLabel);

  return (
    <AppScreenScaffold
      footer={
        <Button
          fullWidth
          disabled={isPosting}
          label={isPosting ? "Posting..." : "Post"}
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
          <TouchableOpacity disabled={isPosting} onPress={handlePostPress}>
            <Typography variant="body-small" className="text-primary">
              {isPosting ? "Posting..." : "Post"}
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
