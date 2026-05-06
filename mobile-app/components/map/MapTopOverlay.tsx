import React from "react";
import { ScrollView, View } from "react-native";

import { MapFilterChip } from "./MapFilterChip";
import { MapSearchBar } from "./MapSearchBar";
import type { MapFilterChipData } from "../../types/map.types";

interface MapTopOverlayProps {
  filters: readonly MapFilterChipData[];
  onSearchQueryChange: (value: string) => void;
  searchQuery: string;
  topInset: number;
}

export function MapTopOverlay({
  filters,
  onSearchQueryChange,
  searchQuery,
  topInset,
}: MapTopOverlayProps): React.JSX.Element {
  return (
    <View
      className="absolute inset-x-0 top-0"
      pointerEvents="box-none"
      style={{ paddingTop: topInset + 4 }}
    >
      <MapSearchBar
        onSearchQueryChange={onSearchQueryChange}
        searchQuery={searchQuery}
      />

      <ScrollView
        className="pt-3"
        contentContainerClassName="gap-2 px-4 pb-2"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((chip: MapFilterChipData) => (
          <MapFilterChip chip={chip} key={chip.id} />
        ))}
      </ScrollView>
    </View>
  );
}
