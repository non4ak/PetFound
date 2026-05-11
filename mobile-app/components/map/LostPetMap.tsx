import React from "react";
import MapView, { PROVIDER_GOOGLE, type LatLng } from "react-native-maps";
import { cssInterop } from "nativewind";

import { PetMapMarker } from "./PetMapMarker";
import { UserLocationMarker } from "./UserLocationMarker";
import {
  CUSTOM_MAP_STYLE,
  INITIAL_REGION,
} from "../../constants/map.constants";
import type { PetMapMarkerData } from "../../types/map.types";

cssInterop(MapView, {
  className: "style",
});

interface LostPetMapProps {
  markers: (PetMapMarkerData | null)[];
  onMarkerPress: (id: number) => void;
  userLocationCoordinate: LatLng;
  mapRef?: React.RefObject<any>;
}

export function LostPetMap({
  markers,
  onMarkerPress,
  userLocationCoordinate,
  mapRef,
}: LostPetMapProps): React.JSX.Element {
  return (
    <MapView
      ref={mapRef}
      className="flex-1"
      customMapStyle={CUSTOM_MAP_STYLE}
      initialRegion={INITIAL_REGION}
      provider={PROVIDER_GOOGLE}
      showsBuildings={false}
      showsIndoors={false}
      showsPointsOfInterest={false}
      showsTraffic={false}
      toolbarEnabled={false}
    >
      <UserLocationMarker coordinate={userLocationCoordinate} />

      {markers.map((marker: PetMapMarkerData | null) => {
        if (!marker) {
          return null;
      ***REMOVED***
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
