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
***REMOVED***,
  {
    id: "found",
    label: "Found",
    variant: "surface",
***REMOVED***,
  {
    id: "dog",
    label: "Dog",
    variant: "surface",
***REMOVED***,
  {
    id: "cat",
    label: "Cat",
    variant: "surface",
***REMOVED***,
];

export const FLOATING_MAP_ACTIONS: readonly FloatingMapActionData[] = [
  {
    accessibilityLabel: "Center map on my location",
    iconName: "my-location",
    id: MAP_MY_LOCATION_ACTION_ID,
***REMOVED***,
];
