import type { ComponentProps } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import type { LatLng } from "react-native-maps";

export type PetMapMarkerType = "found" | "lost";

export interface PetMapMarkerData {
  badges: readonly string[];
  coordinate: LatLng;
  dateLabel: string;
  description: string;
  id: string;
  imageUri: string;
  lostDate: string;
  location: string;
  petDetails: string;
  timeApproximate: string;
  title: string;
  type: PetMapMarkerType;
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
  id: string;
}
