import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { createAnnouncementQuery } from "@/data/queries/announcements";
import type {
  AnnouncementDetails,
  CreateAnnouncementRequest,
} from "@/types/announcement";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  getMapTargetCoordinate,
  getMapTargetParams,
  type MapTargetCoordinate,
} from "@/utils/mapTarget";

interface UseAnnouncementPreviewActionsParams {
  createRequest: () => CreateAnnouncementRequest | null;
  details: AnnouncementDetails;
  resetDraft: () => void;
}

interface AnnouncementPreviewActions {
  isPosting: boolean;
  onBackPress: () => void;
  onOpenMapPress: () => void;
  onPostPress: () => Promise<void>;
}

export function useAnnouncementPreviewActions({
  createRequest,
  details,
  resetDraft,
}: UseAnnouncementPreviewActionsParams): AnnouncementPreviewActions {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const onBackPress = React.useCallback((): void => {
    router.back();
  }, [router]);

  const onOpenMapPress = React.useCallback((): void => {
    const coordinate: MapTargetCoordinate | null = getMapTargetCoordinate(
      details.lastSeenLatitude,
      details.lastSeenLongitude,
    );

    if (coordinate === null) {
      Alert.alert(
        "Location is not available",
        "Choose a location on the map before previewing it.",
      );
      return;
    }

    router.push({
      pathname: "/(tabs)/map",
      params: getMapTargetParams(coordinate),
    });
  }, [details.lastSeenLatitude, details.lastSeenLongitude, router]);

  const onPostPress = React.useCallback(async (): Promise<void> => {
    const request: CreateAnnouncementRequest | null = createRequest();

    if (request === null) {
      return;
    }

    setIsPosting(true);

    try {
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
  }, [createRequest, queryClient, resetDraft, router]);

  return {
    isPosting,
    onBackPress,
    onOpenMapPress,
    onPostPress,
  };
}
