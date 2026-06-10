import type {
  FloatingMapActionData,
  MapFilterChipData,
} from "../types/map.types";
import { MAP_MY_LOCATION_ACTION_ID } from "./map.constants";

export const MAP_FILTER_CHIPS: readonly MapFilterChipData[] = [
  {
    id: "lost",
    label: "Lost",
    variant: "surface",
  },
  {
    id: "found",
    label: "Found",
    variant: "surface",
  },
  {
    id: "dog",
    label: "Dog",
    variant: "surface",
  },
  {
    id: "cat",
    label: "Cat",
    variant: "surface",
  },
];

export const FLOATING_MAP_ACTIONS: readonly FloatingMapActionData[] = [
  {
    accessibilityLabel: "Center map on my location",
    iconName: "my-location",
    id: MAP_MY_LOCATION_ACTION_ID,
  },
];
