import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Typography } from "@/components/ui/Typography";
import { cn } from "@/utils";

import { mapStyles } from "./map.styles";
import type {
  MapFilterChipData,
  MapFilterChipVariant,
} from "../../types/map.types";
import {
  getFilterChipClassName,
  getFilterChipTextColor,
} from "../../utils/map.utils";

interface MapFilterChipProps {
  chip: MapFilterChipData;
  isActive: boolean;
  onPress: (filterId: string) => void;
}

export function MapFilterChip({
  chip,
  isActive,
  onPress,
}: MapFilterChipProps): React.JSX.Element {
  const visualVariant: MapFilterChipVariant = isActive ? "accent" : chip.variant;
  const contentColor: string = getFilterChipTextColor(visualVariant);

  const handlePress = (): void => {
    onPress(chip.id);
***REMOVED***;

  return (
    <TouchableOpacity
      accessibilityState={{ selected: isActive }}
      activeOpacity={0.8}
      className={cn(
        "flex-row items-center rounded-full px-4 py-2",
        getFilterChipClassName(visualVariant),
      )}
      onPress={handlePress}
      style={mapStyles.filterChip}
    >
      {chip.leadingIconName ? (
        <Ionicons
          className="mr-1"
          color={contentColor}
          name={chip.leadingIconName}
          size={16}
        />
      ) : null}

      <Typography
        variant="body-small"
        className="font-semibold"
        style={{ color: contentColor }}
      >
        {chip.label}
      </Typography>

      {chip.trailingIconName ? (
        <Ionicons
          className="ml-1"
          color={contentColor}
          name={chip.trailingIconName}
          size={14}
        />
      ) : null}
    </TouchableOpacity>
  );
}
