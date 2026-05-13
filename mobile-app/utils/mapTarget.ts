export interface MapTargetCoordinate {
  latitude: number;
  longitude: number;
}

export interface MapTargetParams {
  [key: string]: string;
  targetLatitude: string;
  targetLongitude: string;
}

export interface MapTargetRouteParams {
  targetLatitude?: string | string[];
  targetLongitude?: string | string[];
}

export function getMapTargetCoordinate(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): MapTargetCoordinate | null {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
***REMOVED***

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
***REMOVED***

  return {
    latitude,
    longitude,
***REMOVED***;
}

function parseMapTargetRouteValue(
  value: string | string[] | undefined,
): number | null {
  if (typeof value !== "string") {
    return null;
***REMOVED***

  const parsedValue: number = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return null;
***REMOVED***

  return parsedValue;
}

export function getMapTargetCoordinateFromParams(
  params: MapTargetRouteParams,
): MapTargetCoordinate | null {
  return getMapTargetCoordinate(
    parseMapTargetRouteValue(params.targetLatitude),
    parseMapTargetRouteValue(params.targetLongitude),
  );
}

export function getMapTargetParams(
  coordinate: MapTargetCoordinate,
): MapTargetParams {
  return {
    targetLatitude: String(coordinate.latitude),
    targetLongitude: String(coordinate.longitude),
***REMOVED***;
}
