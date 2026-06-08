import React from "react";
import MapView, {
  PROVIDER_GOOGLE,
  type UserLocationChangeEvent,
} from "react-native-maps";
import { cssInterop } from "nativewind";

import { PetMapMarker } from "./PetMapMarker";
import {
  CUSTOM_MAP_STYLE,
  INITIAL_REGION,
} from "../../constants/map.constants";
import type { PetMapMarkerData } from "../../types/map.types";

cssInterop(MapView, {
  className: "style",
});

interface LostPetMapProps {
  markers: PetMapMarkerData[];
  onMapPress: () => void;
  onMapReady: () => void;
  onMarkerPress: (id: number) => void;
  onUserLocationChange: (event: UserLocationChangeEvent) => void;
  showsUserLocation: boolean;
  mapRef?: React.RefObject<MapView | null>;
}

export function LostPetMap({
  markers,
  onMapPress,
  onMapReady,
  onMarkerPress,
  onUserLocationChange,
  showsUserLocation,
  mapRef,
}: LostPetMapProps): React.JSX.Element {
  return (
    <MapView
      ref={mapRef}
      className="flex-1"
      customMapStyle={CUSTOM_MAP_STYLE}
      initialRegion={INITIAL_REGION}
      onPress={onMapPress}
      onMapReady={onMapReady}
      onUserLocationChange={onUserLocationChange}
      provider={PROVIDER_GOOGLE}
      showsBuildings={false}
      showsIndoors={false}
      showsMyLocationButton={false}
      showsPointsOfInterest={false}
      showsTraffic={false}
      showsUserLocation={showsUserLocation}
      toolbarEnabled={false}
    >
      {markers.map((marker: PetMapMarkerData) => {
        return (
          <PetMapMarker
            key={marker.id}
            marker={marker}
            onPress={onMarkerPress}
          />
        );
    ***REMOVED***)}
    </MapView>
  );
}
