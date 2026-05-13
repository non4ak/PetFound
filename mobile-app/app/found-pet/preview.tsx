import React, { useCallback } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { AnnouncementPreviewCard } from "@/components/announcement/AnnouncementPreviewCard";
import { AnnouncementPreviewScaffold } from "@/components/announcement/AnnouncementPreviewScaffold";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";
import { useAnnouncementPreviewActions } from "@/hooks/useAnnouncementPreviewActions";
import type { CreateAnnouncementRequest } from "@/types/announcement";
import {
  createFoundPetAnnouncementRequest,
  FOUND_PET_PREVIEW_TITLE,
  getAnnouncementPreviewBadges,
} from "@/utils/announcementPreview";

export default function FoundPetPreviewScreen(): React.JSX.Element {
  const { details, info, photoUri, resetDraft } = useFoundPetFlow();

  const createRequest = useCallback(
    (): CreateAnnouncementRequest =>
      createFoundPetAnnouncementRequest(details, info, photoUri),
    [details, info, photoUri],
  );

  const { isPosting, onBackPress, onOpenMapPress, onPostPress } =
    useAnnouncementPreviewActions({
      createRequest,
      details,
      resetDraft,
  ***REMOVED***);

  const badges: string[] = getAnnouncementPreviewBadges({
    breed: info.breed,
    petSex: info.petSex,
    petSize: info.petSize,
    petType: info.petType,
***REMOVED***);

  const hasPhoto: boolean = photoUri !== null && photoUri.trim().length > 0;

  return (
    <AnnouncementPreviewScaffold
      isPosting={isPosting}
      onBackPress={onBackPress}
      onPostPress={onPostPress}
    >
      <AnnouncementPreviewCard
        badges={badges}
        details={details}
        onOpenMapPress={onOpenMapPress}
        title={FOUND_PET_PREVIEW_TITLE}
        type="found"
      >
        {hasPhoto ? (
          <Image
            source={{ uri: photoUri ?? "" }}
            style={{ height: 180, width: "100%", borderRadius: 16 }}
            contentFit="cover"
          />
        ) : (
          <View className="h-[180px] w-full items-center justify-center rounded-[16px] bg-[#FFF7EA]">
            <Ionicons name="camera-outline" size={40} color="#D89F35" />
          </View>
        )}
      </AnnouncementPreviewCard>
    </AnnouncementPreviewScaffold>
  );
}
