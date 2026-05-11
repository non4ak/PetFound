import { PET_MARKER_COLORS } from "../constants/map.constants";
import type { MapFilterChipVariant, PetMapMarkerType } from "../types/map.types";

export function getFilterChipClassName(variant: MapFilterChipVariant): string {
  if (variant === "accent") {
    return "bg-primary";
  }

  return "bg-white";
}

export function getFilterChipTextColor(variant: MapFilterChipVariant): string {
  if (variant === "accent") {
    return "#0F172A";
  }

  return "#000000";
}

export function getPetMarkerColor(type: PetMapMarkerType): string {
  return PET_MARKER_COLORS[type];
}
