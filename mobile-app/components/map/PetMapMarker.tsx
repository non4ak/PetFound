import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Callout, Marker } from "react-native-maps";

import {
  PET_MARKER_COLORS,
  USER_LOCATION_MARKER_ANCHOR,
} from "../../constants/map.constants";
import type { PetMapMarkerData } from "../../types/map.types";

interface PetMapMarkerProps {
  marker: PetMapMarkerData;
  onPress: (marker: PetMapMarkerData) => void;
}

const MARKER_SIZE: number = 36;
const MARKER_BORDER: number = 3;
const MARKER_IMAGE_SIZE: number = MARKER_SIZE - MARKER_BORDER * 2;

function getDaysAgo(dateStr: string): number {
  const lostDate: Date = new Date(dateStr);
  const currentDate: Date = new Date();
  const diff: number = currentDate.getTime() - lostDate.getTime();

  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

const styles = StyleSheet.create({
  callout: {
    padding: 8,
    width: 180,
  },
  calloutDate: {
    color: "#8D8D8D",
    fontSize: 12,
  },
  calloutDays: {
    color: "#8D8D8D",
    fontSize: 12,
    marginTop: 1,
  },
  calloutName: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  calloutStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  image: {
    borderRadius: MARKER_IMAGE_SIZE / 2,
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
  },
  imageWrap: {
    alignItems: "center",
    borderRadius: MARKER_SIZE / 2,
    borderWidth: MARKER_BORDER,
    height: MARKER_SIZE,
    justifyContent: "center",
    overflow: "hidden",
    width: MARKER_SIZE,
  },
});

export function PetMapMarker({
  marker,
  onPress,
}: PetMapMarkerProps): React.JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const color: string = PET_MARKER_COLORS[marker.type];
  const daysAgo: number = getDaysAgo(marker.lostDate);
  const isLost: boolean = marker.type === "lost";

  const handlePress = (): void => {
    onPress(marker);
  };

  return (
    <Marker
      anchor={USER_LOCATION_MARKER_ANCHOR}
      coordinate={marker.coordinate}
      onPress={handlePress}
      tracksViewChanges={loading}
    >
      <View style={[styles.imageWrap, { borderColor: color }]}>
        <Image
          fadeDuration={0}
          onLoad={() => setLoading(false)}
          resizeMode="cover"
          source={{ uri: marker.imageUri }}
          style={styles.image}
        />
      </View>
    </Marker>
  );
}
