import type { LatLng, MapStyleElement, Region } from "react-native-maps";

import type { PetMapMarkerType } from "../types/map.types";

export const MAP_TAB_BAR_OFFSET: number = 96;

export const INITIAL_REGION: Region = {
  latitude: 50.4501,
  latitudeDelta: 0.04,
  longitude: 30.5234,
  longitudeDelta: 0.04,
};

export const USER_LOCATION_COORDINATE: LatLng = {
  latitude: 50.4461,
  longitude: 30.5264,
};

export const USER_LOCATION_MARKER_ANCHOR: {
  readonly x: number;
  readonly y: number;
} = {
  x: 0.5,
  y: 0.5,
};

export const PET_MARKER_COLORS: Record<PetMapMarkerType, string> = {
  found: "#F2C94C",
  lost: "#E9484D",
};

export const CUSTOM_MAP_STYLE: MapStyleElement[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f2efe9" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0aaa0" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f2efe9" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9c3b8" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#dcd8d2" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#dcd8d2" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#d4d0c9" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9c3b8" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#e8e4dd" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d4e4ed" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9eb8cc" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#eceae4" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#e8e5de" }],
  },
];
