import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LostPetMap } from "@/components/map/LostPetMap";
import { MapFloatingControls } from "@/components/map/MapFloatingControls";
import { MapTopOverlay } from "@/components/map/MapTopOverlay";
import { FLOATING_MAP_ACTIONS, MAP_FILTER_CHIPS } from "@/constants/map.data";
import {
  MAP_TAB_BAR_OFFSET,
  USER_LOCATION_COORDINATE,
} from "@/constants/map.constants";
import type { PetMapMarkerData } from "@/types/map.types";
import { useGetAnnouncements } from "@/data/hooks/announcements";
import type { AnnouncementQueryFilter } from "@/types/announcement";

export default function MapScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<AnnouncementQueryFilter>({});
  const {
    data: announcements,
    isLoading,
    isError,
***REMOVED*** = useGetAnnouncements(searchQuery);

  const EXAMPLE_MARKERS = announcements?.data.items.map((announcement) => ({
    id: announcement.id,
    latitude: announcement.latitude,
    longitude: announcement.longitude,
    petId: announcement.petId,
***REMOVED***));

  const handleMarkerPress = (marker: PetMapMarkerData): void => {
    router.push({
      pathname: "/pet/[id]",
      params: { id: marker.id },
  ***REMOVED***);
***REMOVED***;

  return (
    <View className="flex-1 bg-[#f2efe9]">
      <LostPetMap
        markers={EXAMPLE_MARKERS}
        onMarkerPress={handleMarkerPress}
        userLocationCoordinate={USER_LOCATION_COORDINATE}
      />

      <MapTopOverlay
        filters={MAP_FILTER_CHIPS}
        onSearchQueryChange={setSearchQuery}
        searchQuery={searchQuery}
        topInset={insets.top}
      />

      <MapFloatingControls
        actions={FLOATING_MAP_ACTIONS}
        bottomInset={insets.bottom}
        tabBarOffset={MAP_TAB_BAR_OFFSET}
      />
    </View>
  );
}
