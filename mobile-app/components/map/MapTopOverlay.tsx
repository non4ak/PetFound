import React from "react";
import { ScrollView, View } from "react-native";

import {
  MAP_FILTERS_TOP_OFFSET,
  MAP_SEARCH_TOP_OFFSET,
} from "@/constants/map.constants";

import { MapFilterChip } from "./MapFilterChip";
import { MapSearchBar, type MapSearchBarRef } from "./MapSearchBar";
import type {
  MapFilterChipData,
  MapPlaceLocation,
} from "../../types/map.types";

interface MapTopOverlayProps {
  activeFilterIds: readonly string[];
  filters: readonly MapFilterChipData[];
  onFilterPress: (filterId: string) => void;
  onPlaceSelected: (location: MapPlaceLocation | null) => void;
  searchBarRef: React.RefObject<MapSearchBarRef | null>;
  topInset: number;
}

export function MapTopOverlay({
  activeFilterIds,
  filters,
  onFilterPress,
  onPlaceSelected,
  searchBarRef,
  topInset,
}: MapTopOverlayProps): React.JSX.Element {
  return (
    <View className="absolute inset-x-0 top-0 z-50" pointerEvents="box-none">
      <View
        pointerEvents="box-none"
        style={{ marginTop: topInset + MAP_FILTERS_TOP_OFFSET }}
      >
        <ScrollView
          contentContainerClassName="gap-2 px-4 pb-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {filters.map((chip: MapFilterChipData) => (
            <MapFilterChip
              chip={chip}
              isActive={activeFilterIds.includes(chip.id)}
              key={chip.id}
              onPress={onFilterPress}
            />
          ))}
        </ScrollView>
      </View>

      <View
        className="absolute inset-x-0"
        pointerEvents="box-none"
        style={{ top: topInset + MAP_SEARCH_TOP_OFFSET }}
      >
        <MapSearchBar ref={searchBarRef} onPlaceSelected={onPlaceSelected} />
      </View>
    </View>
  );
}
