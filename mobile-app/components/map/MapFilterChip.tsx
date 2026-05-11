import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Typography } from "@/components/ui/Typography";
import { cn } from "@/utils";

import { mapStyles } from "./map.styles";
import type { MapFilterChipData } from "../../types/map.types";
import {
  getFilterChipClassName,
  getFilterChipTextColor,
} from "../../utils/map.utils";

interface MapFilterChipProps {
  chip: MapFilterChipData;
}

export function MapFilterChip({ chip }: MapFilterChipProps): React.JSX.Element {
  const contentColor: string = getFilterChipTextColor(chip.variant);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={cn(
        "flex-row items-center rounded-full px-4 py-2",
        getFilterChipClassName(chip.variant),
      )}
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
