import React from "react";
import { useRouter } from "expo-router";
import type { LatLng } from "react-native-maps";

import {
  AnnouncementLocationMapPicker,
  type PickedAnnouncementLocation,
} from "@/components/announcement/AnnouncementLocationMapPicker";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";

export default function FoundPetLocationPickerScreen(): React.JSX.Element {
  const router = useRouter();
  const { details, updateDetails } = useFoundPetFlow();

  const initialCoordinate: LatLng | null =
    details.lastSeenLatitude !== null && details.lastSeenLongitude !== null
      ? {
          latitude: details.lastSeenLatitude,
          longitude: details.lastSeenLongitude,
        }
      : null;

  const handleConfirm = (location: PickedAnnouncementLocation): void => {
    updateDetails({
      ...details,
      city: location.city ?? details.city,
      country: location.country ?? details.country,
      lastSeenLatitude: location.latitude,
      lastSeenLongitude: location.longitude,
    });
    router.back();
  };

  return (
    <AnnouncementLocationMapPicker
      initialCoordinate={initialCoordinate}
      onCancel={router.back}
      onConfirm={handleConfirm}
    />
  );
}
