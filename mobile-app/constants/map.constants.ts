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
***REMOVED***,
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
***REMOVED***,
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0aaa0" }],
***REMOVED***,
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f2efe9" }],
***REMOVED***,
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9c3b8" }],
***REMOVED***,
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
***REMOVED***,
  {
    featureType: "administrative.neighborhood",
    stylers: [{ visibility: "off" }],
***REMOVED***,
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
***REMOVED***,
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
***REMOVED***,
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#dcd8d2" }],
***REMOVED***,
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "simplified" }],
***REMOVED***,
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
***REMOVED***,
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#dcd8d2" }],
***REMOVED***,
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#d4d0c9" }],
***REMOVED***,
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9c3b8" }],
***REMOVED***,
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#e8e4dd" }],
***REMOVED***,
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
***REMOVED***,
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d4e4ed" }],
***REMOVED***,
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9eb8cc" }],
***REMOVED***,
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#eceae4" }],
***REMOVED***,
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#e8e5de" }],
***REMOVED***,
];
