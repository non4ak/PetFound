import type {
  FloatingMapActionData,
  MapFilterChipData,
  PetMapMarkerData,
} from "../types/map.types";

export const EXAMPLE_MARKERS: readonly PetMapMarkerData[] = [
  {
    badges: ["Bird", "Parrot", "Male", "Green"],
    coordinate: { latitude: 50.4571, longitude: 30.5134 },
    dateLabel: "Apr 28, approx. 09:30",
    description: "Lost parrot",
    id: "1",
    imageUri:
      "https://images.unsplash.com/photo-1552728089-57168a151b75?q=80&w=200&auto=format&fit=crop",
    lostDate: "2026-04-28",
    location: "Podil, Kyiv",
    petDetails: "Very talkative parrot. Usually responds to familiar voices.",
    timeApproximate: "09:30",
    title: "Parrot",
    type: "lost",
  },
  {
    badges: ["Dog", "Labrador", "Male", "Golden", "Large"],
    coordinate: { latitude: 50.4501, longitude: 30.5234 },
    dateLabel: "Today, approx. 14:00",
    description:
      "Usually runs toward people. Check near the market and surrounding yards.",
    id: "2",
    imageUri:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop",
    lostDate: "2026-05-01",
    location: "Saltivka, Kharkiv",
    petDetails: "Has a red collar with a bell. Very friendly and active.",
    timeApproximate: "14:00",
    title: "Buddy",
    type: "lost",
  },
  {
    badges: ["Cat", "Tabby", "Female", "Small"],
    coordinate: { latitude: 50.4435, longitude: 30.5368 },
    dateLabel: "Today, approx. 18:20",
    description: "Found cat",
    id: "3",
    imageUri:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop",
    lostDate: "2026-05-05",
    location: "Pechersk, Kyiv",
    petDetails: "Calm tabby cat. Found near a residential entrance.",
    timeApproximate: "18:20",
    title: "Tabby Cat",
    type: "found",
  },
];

export const MAP_FILTER_CHIPS: readonly MapFilterChipData[] = [
  {
    id: "filters",
    label: "Filters",
    leadingIconName: "options-outline",
    variant: "accent",
  },
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
    id: "species",
    label: "Species",
    trailingIconName: "chevron-down",
    variant: "surface",
  },
];

export const FLOATING_MAP_ACTIONS: readonly FloatingMapActionData[] = [
  {
    accessibilityLabel: "Center map on my location",
    iconName: "my-location",
    id: "my-location",
  },
  {
    accessibilityLabel: "Change map layers",
    iconName: "layers",
    id: "layers",
  },
];
