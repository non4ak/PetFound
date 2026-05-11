import React, { useState } from "react";
import { Image, View } from "react-native";
import { Marker } from "react-native-maps";

import {
  PET_MARKER_COLORS,
  USER_LOCATION_MARKER_ANCHOR,
} from "@/constants/map.constants";
import type { PetMapMarkerData } from "@/types/map.types";
import { petMarkerStyles } from "@/components/map/map.styles";

interface PetMapMarkerProps {
  marker: PetMapMarkerData;
  onPress: (id: number) => void;
}

export function PetMapMarker({ marker, onPress }: PetMapMarkerProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const color = PET_MARKER_COLORS[marker.type];

  const handlePress = () => {
    onPress(marker.id);
  };

  return (
    <Marker
      anchor={USER_LOCATION_MARKER_ANCHOR}
      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
      onPress={handlePress}
      tracksViewChanges={loading}
    >
      <View style={[petMarkerStyles.imageWrap, { borderColor: color }]}>
        <Image
          fadeDuration={0}
          onLoad={() => setLoading(false)}
          resizeMode="cover"
          source={{
            uri: !marker.imageUri?.startsWith("http")
              ? "https://images.unsplash.com/photo-1552728089-57168a151b75?q=80&w=200&auto=format&fit=crop"
              : marker.imageUri,
          }}
          style={petMarkerStyles.image}
        />
      </View>
    </Marker>
  );
}
