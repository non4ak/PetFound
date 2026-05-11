import React from "react";
import { ScrollView, View } from "react-native";

import { MapFilterChip } from "./MapFilterChip";
import { MapSearchBar } from "./MapSearchBar";
import type { MapFilterChipData } from "../../types/map.types";

interface MapTopOverlayProps {
  filters: readonly MapFilterChipData[];
  onPlaceSelected: (location: { lat: number; lng: number } | null) => void;
  topInset: number;
}

export function MapTopOverlay({
  filters,
  onPlaceSelected,
  topInset,
}: MapTopOverlayProps): React.JSX.Element {
  return (
    <View
      className="absolute inset-x-0 top-0 z-50"
      pointerEvents="box-none"
    >
      <View pointerEvents="box-none" style={{ marginTop: topInset + 60 }}>
        <ScrollView
          contentContainerClassName="gap-2 px-4 pb-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {filters.map((chip: MapFilterChipData) => (
            <MapFilterChip chip={chip} key={chip.id} />
          ))}
        </ScrollView>
      </View>

      <View className="absolute inset-x-0" pointerEvents="box-none" style={{ top: topInset + 4 }}>
        <MapSearchBar onPlaceSelected={onPlaceSelected} />
      </View>
    </View>
  );
}
