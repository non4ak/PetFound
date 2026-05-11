import React, { useState, useRef } from "react";
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
  const mapRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState<AnnouncementQueryFilter>({});
  const {
    data: announcements,
    isLoading,
    isError,
***REMOVED*** = useGetAnnouncements(searchQuery);

  const markers: (PetMapMarkerData | null)[] =
    announcements?.items.map((announcement) => {
      if (
        announcement.lastSeenLatitude === null ||
        announcement.lastSeenLongitude === null
      ) {
        return null;
    ***REMOVED***
      return {
        id: announcement.id,
        latitude: announcement.lastSeenLatitude,
        longitude: announcement.lastSeenLongitude,
        petId: announcement.petId,
        imageUri: announcement.petPhotoUrl?.startsWith("http")
          ? announcement.petPhotoUrl
          : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop",
        type: announcement.petStatus === 0 ? "lost" : "found",
        lostDate: announcement.lastDateWhenSeen || new Date().toISOString(),
    ***REMOVED***;
  ***REMOVED***) || [];

  const handleMarkerPress = (id: number): void => {
    router.push({
      pathname: "/pet/[id]",
      params: { id: id },
  ***REMOVED***);
***REMOVED***;

  const handlePlaceSelected = React.useCallback((location: { lat: number; lng: number } | null) => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    ***REMOVED***);
  ***REMOVED***
***REMOVED***, []);

  return (
    <View className="flex-1 bg-[#f2efe9]">
      <LostPetMap
        mapRef={mapRef}
        markers={markers}
        onMarkerPress={handleMarkerPress}
        userLocationCoordinate={USER_LOCATION_COORDINATE}
      />

      <MapTopOverlay
        filters={MAP_FILTER_CHIPS}
        onPlaceSelected={handlePlaceSelected}
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
