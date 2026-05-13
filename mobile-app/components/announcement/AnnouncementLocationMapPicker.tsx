import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, {
  PROVIDER_GOOGLE,
  type LatLng,
  type Region,
} from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { CUSTOM_MAP_STYLE, INITIAL_REGION } from "@/constants/map.constants";

export interface PickedAnnouncementLocation {
  city: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
}

interface AnnouncementLocationMapPickerProps {
  initialCoordinate: LatLng | null;
  onCancel: () => void;
  onConfirm: (location: PickedAnnouncementLocation) => void;
}

function createRegionFromCoordinate(coordinate: LatLng): Region {
  return {
    latitude: coordinate.latitude,
    latitudeDelta: 0.02,
    longitude: coordinate.longitude,
    longitudeDelta: 0.02,
***REMOVED***;
}

function resolveCityName(address: Location.LocationGeocodedAddress): string | null {
  const city: string = (
    address.city ??
    address.district ??
    address.subregion ??
    address.region ??
    ""
  ).trim();

  return city.length > 0 ? city : null;
}

function resolveCountryName(address: Location.LocationGeocodedAddress): string | null {
  const country: string = (address.country ?? address.isoCountryCode ?? "").trim();

  return country.length > 0 ? country : null;
}

async function reverseGeocodeCoordinate(
  coordinate: LatLng,
): Promise<PickedAnnouncementLocation> {
  const addresses: Location.LocationGeocodedAddress[] =
    await Location.reverseGeocodeAsync(coordinate);
  const address: Location.LocationGeocodedAddress | undefined = addresses[0];

  return {
    city: address ? resolveCityName(address) : null,
    country: address ? resolveCountryName(address) : null,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
***REMOVED***;
}

export function AnnouncementLocationMapPicker({
  initialCoordinate,
  onCancel,
  onConfirm,
}: AnnouncementLocationMapPickerProps): React.JSX.Element {
  const [region, setRegion] = useState<Region>(
    initialCoordinate ? createRegionFromCoordinate(initialCoordinate) : INITIAL_REGION,
  );
  const [isResolving, setIsResolving] = useState<boolean>(false);

  useEffect(() => {
    let isMounted: boolean = true;

    async function loadCurrentLocationAsInitialRegion(): Promise<void> {
      if (initialCoordinate !== null) {
        return;
    ***REMOVED***

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        return;
    ***REMOVED***

      const location: Location.LocationObject =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
      ***REMOVED***);

      if (!isMounted) {
        return;
    ***REMOVED***

      setRegion(
        createRegionFromCoordinate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
      ***REMOVED***),
      );
  ***REMOVED***

    void loadCurrentLocationAsInitialRegion();

    return () => {
      isMounted = false;
  ***REMOVED***;
***REMOVED***, [initialCoordinate]);

  const handleRegionChangeComplete = useCallback((nextRegion: Region): void => {
    setRegion(nextRegion);
***REMOVED***, []);

  const handleConfirmPress = useCallback(async (): Promise<void> => {
    try {
      setIsResolving(true);
      const pickedLocation: PickedAnnouncementLocation =
        await reverseGeocodeCoordinate({
          latitude: region.latitude,
          longitude: region.longitude,
      ***REMOVED***);

      onConfirm(pickedLocation);
  ***REMOVED*** catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Unknown geocoding error.";

      Alert.alert(
        "Location error",
        `Could not resolve this location. ${message}`,
      );
  ***REMOVED*** finally {
      setIsResolving(false);
  ***REMOVED***
***REMOVED***, [onConfirm, region.latitude, region.longitude]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
          onPress={onCancel}
        >
          <Ionicons name="arrow-back" size={20} color="#94A3B8" />
        </TouchableOpacity>
        <Typography variant="body-regular" className="font-semibold text-heading-text">
          Choose location
        </Typography>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1">
        <MapView
          customMapStyle={CUSTOM_MAP_STYLE}
          onRegionChangeComplete={handleRegionChangeComplete}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsBuildings={false}
          showsIndoors={false}
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsTraffic={false}
          style={StyleSheet.absoluteFillObject}
          toolbarEnabled={false}
        />

        <View pointerEvents="none" style={styles.centerMarker}>
          <Ionicons name="location-sharp" size={42} color="#E9484D" />
        </View>
      </View>

      <View className="gap-3 px-4 pb-4 pt-3">
        <Typography variant="body-small" className="text-center text-secondary-text">
          Move the map until the pin points to the place where the pet was seen.
        </Typography>
        <Button
          disabled={isResolving}
          fullWidth
          label={isResolving ? "Picking location..." : "Use this location"}
          leadingIcon={
            isResolving ? (
              <ActivityIndicator color="#0F172A" size="small" />
            ) : null
        ***REMOVED***
          onPress={handleConfirmPress}
          size="md"
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerMarker: {
    left: "50%",
    marginLeft: -21,
    marginTop: -42,
    position: "absolute",
    top: "50%",
***REMOVED***,
});
