import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LostPetMap } from "@/components/map/LostPetMap";
import { MapFloatingControls } from "@/components/map/MapFloatingControls";
import { MapTopOverlay } from "@/components/map/MapTopOverlay";
import { FLOATING_MAP_ACTIONS, MAP_FILTER_CHIPS } from "@/constants/map.data";
import { MAP_TAB_BAR_OFFSET } from "@/constants/map.constants";
import { useLostPetMapController } from "@/hooks/useLostPetMapController";

export default function MapScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    activeFilterIds,
    mapRef,
    markers,
    onFilterPress,
    onFloatingActionPress,
    onMapPress,
    onMarkerPress,
    onPlaceSelected,
    onUserLocationChange,
    searchBarRef,
    showsUserLocation,
***REMOVED*** = useLostPetMapController();

  return (
    <View className="flex-1 bg-[#f2efe9]">
      <LostPetMap
        mapRef={mapRef}
        markers={markers}
        onMapPress={onMapPress}
        onMarkerPress={onMarkerPress}
        onUserLocationChange={onUserLocationChange}
        showsUserLocation={showsUserLocation}
      />

      <MapTopOverlay
        activeFilterIds={activeFilterIds}
        filters={MAP_FILTER_CHIPS}
        onFilterPress={onFilterPress}
        onPlaceSelected={onPlaceSelected}
        searchBarRef={searchBarRef}
        topInset={insets.top}
      />

      <MapFloatingControls
        actions={FLOATING_MAP_ACTIONS}
        bottomInset={insets.bottom}
        onActionPress={onFloatingActionPress}
        tabBarOffset={MAP_TAB_BAR_OFFSET}
      />
    </View>
  );
}
