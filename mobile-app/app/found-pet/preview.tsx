import React, { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useQueryClient } from "@tanstack/react-query";

import { AnnouncementPreviewCard } from "@/components/announcement/AnnouncementPreviewCard";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";
import { createAnnouncementQuery } from "@/data/queries/announcements";
import {
  AnnouncementPetStatus,
  type CreateAnnouncementRequest,
} from "@/types/announcement";
import { toAnnouncementDateTimeOffset } from "@/utils/announcementDate";
import { getApiErrorMessage } from "@/utils/apiError";
import { getPetSexLabel, getPetSizeLabel, getPetTypeLabel } from "@/utils/petLabels";

export default function FoundPetPreviewScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { details, info, photoUri, resetDraft } = useFoundPetFlow();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handlePostPress = async (): Promise<void> => {
    setIsPosting(true);

    try {
      const request: CreateAnnouncementRequest = {
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
        petName: "Found pet",
        petStatus: AnnouncementPetStatus.Found,
        ...(info.breed.trim().length > 0 ? { breed: info.breed.trim() } : {}),
        ...(info.chipNumber.trim().length > 0
          ? { chipNumber: info.chipNumber.trim() }
          : {}),
        ...(info.petAgeCategory !== null
          ? { petAgeCategory: info.petAgeCategory }
          : {}),
        ...(photoUri !== null && photoUri.trim().length > 0
          ? { petPhotoUrl: photoUri.trim() }
          : {}),
        ...(info.petSex !== null ? { petSex: info.petSex } : {}),
        ...(info.petSize !== null ? { petSize: info.petSize } : {}),
        ...(info.petType !== null ? { petType: info.petType } : {}),
      };

      await createAnnouncementQuery(request);
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
      resetDraft();
      router.replace("/(tabs)");
    } catch (error: unknown) {
      Alert.alert(
        "Post failed",
        getApiErrorMessage(error, "Could not create announcement."),
      );
    } finally {
      setIsPosting(false);
    }
  };

  const badges: string[] = [getPetTypeLabel(info.petType)];
  if (info.breed.trim().length > 0) badges.push(info.breed);
  const sexLabel = getPetSexLabel(info.petSex);
  if (sexLabel !== null) badges.push(sexLabel);
  const sizeLabel = getPetSizeLabel(info.petSize);
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
          }
          variant="primary"
        />
      }
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
      }
    >
      <Typography variant="body-small" className="text-secondary-text">
        How your post will look in the feed
      </Typography>

      <AnnouncementPreviewCard
        badges={badges}
        details={details}
        title="Found pet"
        type="found"
      >
        {photoUri !== null && photoUri.trim().length > 0 ? (
          <Image
            source={{ uri: photoUri }}
            style={{ height: 180, width: "100%", borderRadius: 16 }}
            contentFit="cover"
          />
        ) : (
          <View className="h-[180px] w-full items-center justify-center rounded-[16px] bg-[#FFF7EA]">
            <Ionicons name="camera-outline" size={40} color="#D89F35" />
          </View>
        )}
      </AnnouncementPreviewCard>
    </AppScreenScaffold>
  );
}
