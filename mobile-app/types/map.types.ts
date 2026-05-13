import type { ComponentProps } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export type PetMapMarkerType = "found" | "lost";
export type PetTypeQueryValue = 0 | 1;
export type MapFloatingActionId = "my-location";

export interface PetMapMarkerData {
  id: number;
  latitude: number;
  longitude: number;
  petId: number;
  imageUri: string;
  type: PetMapMarkerType;
}

export interface MapPlaceLocation {
  lat: number;
  lng: number;
}

export type MapFilterChipVariant = "accent" | "surface";

export type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export interface MapFilterChipData {
  id: string;
  label: string;
  leadingIconName?: IoniconName;
  trailingIconName?: IoniconName;
  variant: MapFilterChipVariant;
}

export interface FloatingMapActionData {
  accessibilityLabel: string;
  iconName: MaterialIconName;
  id: MapFloatingActionId;
}
