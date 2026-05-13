import React, { useCallback, useEffect } from "react";
import { Image } from "react-native";
import { useRouter } from "expo-router";

import { AnnouncementPreviewCard } from "@/components/announcement/AnnouncementPreviewCard";
import { AnnouncementPreviewScaffold } from "@/components/announcement/AnnouncementPreviewScaffold";
import { useLostPetFlow } from "@/contexts/LostPetFlowContext";
import { useAnnouncementPreviewActions } from "@/hooks/useAnnouncementPreviewActions";
import type { CreateAnnouncementRequest } from "@/types/announcement";
import {
  createLostPetAnnouncementRequest,
  getAnnouncementPreviewBadges,
} from "@/utils/announcementPreview";

export default function LostPetPreviewScreen(): React.JSX.Element | null {
  const router = useRouter();
  const { details, resetDraft, selectedPet } = useLostPetFlow();

  useEffect(() => {
    if (selectedPet === null) {
      router.replace("/lost-pet");
  ***REMOVED***
***REMOVED***, [router, selectedPet]);

  const createRequest = useCallback((): CreateAnnouncementRequest | null => {
    if (selectedPet === null) {
      return null;
  ***REMOVED***

    return createLostPetAnnouncementRequest(details, selectedPet);
***REMOVED***, [details, selectedPet]);

  const { isPosting, onBackPress, onOpenMapPress, onPostPress } =
    useAnnouncementPreviewActions({
      createRequest,
      details,
      resetDraft,
  ***REMOVED***);

  if (selectedPet === null) {
    return null;
***REMOVED***

  const badges: string[] = getAnnouncementPreviewBadges({
    breed: selectedPet.breed,
    petSex: selectedPet.petSex,
    petSize: selectedPet.petSize,
    petType: selectedPet.petType,
***REMOVED***);

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
        title={selectedPet.petName}
        type="lost"
      >
        <Image
          className="h-[180px] w-full rounded-[16px]"
          resizeMode="cover"
          source={{ uri: selectedPet.imageUrl }}
        />
      </AnnouncementPreviewCard>
    </AnnouncementPreviewScaffold>
  );
}
