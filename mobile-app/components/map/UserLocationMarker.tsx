import React from "react";
import { View } from "react-native";
import { Marker, type LatLng } from "react-native-maps";

import { USER_LOCATION_MARKER_ANCHOR } from "../../constants/map.constants";
import { mapStyles } from "./map.styles";

interface UserLocationMarkerProps {
  coordinate: LatLng;
}

export function UserLocationMarker({
  coordinate,
}: UserLocationMarkerProps): React.JSX.Element {
  return (
    <Marker anchor={USER_LOCATION_MARKER_ANCHOR} coordinate={coordinate}>
      <View style={mapStyles.userLocationPulse}>
        <View
          style={[mapStyles.userLocationDot, { backgroundColor: "#4285F4" }]}
        />
      </View>
    </Marker>
  );
}
