import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import type MapView from "react-native-maps";
import type { LatLng, UserLocationChangeEvent } from "react-native-maps";

import type { MapSearchBarRef } from "@/components/map/MapSearchBar";
import {
  MAP_MY_LOCATION_ACTION_ID,
  MAP_PET_LOCATION_REGION_DELTA,
  MAP_SEARCH_PLACE_REGION_DELTA,
  MAP_USER_LOCATION_REGION_DELTA,
} from "@/constants/map.constants";
import { useGetAnnouncements } from "@/data/hooks/announcements";
import type { AnnouncementQueryFilter } from "@/types/announcement";
import type {
  MapFloatingActionId,
  MapPlaceLocation,
  PetMapMarkerData,
} from "@/types/map.types";
import {
  getActiveMapFilterIds,
  getNextMapFilterQuery,
  mapAnnouncementsToMarkers,
} from "@/utils/map.utils";
import {
  getMapTargetCoordinateFromParams,
  type MapTargetCoordinate,
} from "@/utils/mapTarget";

interface LostPetMapController {
  activeFilterIds: string[];
  mapRef: React.RefObject<MapView | null>;
  markers: PetMapMarkerData[];
  onFloatingActionPress: (actionId: MapFloatingActionId) => Promise<void>;
  onFilterPress: (filterId: string) => void;
  onMapPress: () => void;
  onMapReady: () => void;
  onMarkerPress: (id: number) => void;
  onPlaceSelected: (location: MapPlaceLocation | null) => void;
  onUserLocationChange: (event: UserLocationChangeEvent) => void;
  searchBarRef: React.RefObject<MapSearchBarRef | null>;
  showsUserLocation: boolean;
}

function mapLocationToCoordinate(location: Location.LocationObject): LatLng {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

export function useLostPetMapController(): LostPetMapController {
  const router = useRouter();
  const { targetLatitude, targetLongitude } = useLocalSearchParams<{
    targetLatitude?: string;
    targetLongitude?: string;
  }>();
  const mapRef = useRef<MapView | null>(null);
  const searchBarRef = useRef<MapSearchBarRef | null>(null);
  const [searchQuery, setSearchQuery] = useState<AnnouncementQueryFilter>({});
  const [userLocationCoordinate, setUserLocationCoordinate] =
    useState<LatLng | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [showsUserLocation, setShowsUserLocation] = useState<boolean>(false);
  const { data: announcements } = useGetAnnouncements(searchQuery);

  const targetCoordinate: MapTargetCoordinate | null = React.useMemo(
    () =>
      getMapTargetCoordinateFromParams({
        targetLatitude,
        targetLongitude,
      }),
    [targetLatitude, targetLongitude],
  );

  const markers: PetMapMarkerData[] = React.useMemo(
    () => mapAnnouncementsToMarkers(announcements?.items),
    [announcements?.items],
  );

  const activeFilterIds: string[] = React.useMemo(
    () => getActiveMapFilterIds(searchQuery),
    [searchQuery],
  );

  const blurSearch = React.useCallback((): void => {
    searchBarRef.current?.blur();
  }, []);

  const centerMapOnCoordinate = React.useCallback(
    (coordinate: LatLng, regionDelta: number): void => {
      mapRef.current?.animateToRegion({
        latitude: coordinate.latitude,
        latitudeDelta: regionDelta,
        longitude: coordinate.longitude,
        longitudeDelta: regionDelta,
      });
    },
    [],
  );

  const getCurrentUserCoordinate =
    React.useCallback(async (): Promise<LatLng | null> => {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setShowsUserLocation(false);
        return null;
      }

      setShowsUserLocation(true);

      const location: Location.LocationObject =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      return mapLocationToCoordinate(location);
    }, []);

  React.useEffect(() => {
    let isMounted: boolean = true;

    async function loadUserLocation(): Promise<void> {
      const coordinate: LatLng | null = await getCurrentUserCoordinate();

      if (!isMounted || coordinate === null) {
        return;
      }

      setUserLocationCoordinate(coordinate);
    }

    void loadUserLocation();

    return () => {
      isMounted = false;
    };
  }, [getCurrentUserCoordinate]);

  React.useEffect(() => {
    if (!isMapReady || targetCoordinate === null) {
      return;
    }

    centerMapOnCoordinate(targetCoordinate, MAP_PET_LOCATION_REGION_DELTA);
  }, [centerMapOnCoordinate, isMapReady, targetCoordinate]);

  React.useEffect(() => {
    if (
      !isMapReady ||
      targetCoordinate !== null ||
      userLocationCoordinate === null
    ) {
      return;
    }

    centerMapOnCoordinate(
      userLocationCoordinate,
      MAP_USER_LOCATION_REGION_DELTA,
    );
  }, [
    centerMapOnCoordinate,
    isMapReady,
    targetCoordinate,
    userLocationCoordinate,
  ]);

  const onMapReady = React.useCallback((): void => {
    setIsMapReady(true);
  }, []);

  const onMarkerPress = React.useCallback(
    (id: number): void => {
      blurSearch();
      router.push({
        pathname: "/pet/[id]",
        params: { id },
      });
    },
    [blurSearch, router],
  );

  const onPlaceSelected = React.useCallback(
    (location: MapPlaceLocation | null): void => {
      if (location === null) {
        return;
      }

      centerMapOnCoordinate(
        {
          latitude: location.lat,
          longitude: location.lng,
        },
        MAP_SEARCH_PLACE_REGION_DELTA,
      );
    },
    [centerMapOnCoordinate],
  );

  const onFilterPress = React.useCallback(
    (filterId: string): void => {
      blurSearch();
      setSearchQuery((currentQuery: AnnouncementQueryFilter) =>
        getNextMapFilterQuery(currentQuery, filterId),
      );
    },
    [blurSearch],
  );

  const onMapPress = React.useCallback((): void => {
    blurSearch();
  }, [blurSearch]);

  const onUserLocationChange = React.useCallback(
    (event: UserLocationChangeEvent): void => {
      const coordinate: LatLng | undefined = event.nativeEvent.coordinate;

      if (coordinate === undefined) {
        return;
      }

      setUserLocationCoordinate({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    },
    [],
  );

  const onFloatingActionPress = React.useCallback(
    async (actionId: MapFloatingActionId): Promise<void> => {
      blurSearch();

      if (actionId !== MAP_MY_LOCATION_ACTION_ID) {
        return;
      }

      if (userLocationCoordinate !== null) {
        centerMapOnCoordinate(
          userLocationCoordinate,
          MAP_USER_LOCATION_REGION_DELTA,
        );
        return;
      }

      const coordinate: LatLng | null = await getCurrentUserCoordinate();

      if (coordinate === null) {
        Alert.alert(
          "Location access needed",
          "Allow location access to show your position on the map.",
        );
        return;
      }

      setUserLocationCoordinate(coordinate);
      centerMapOnCoordinate(coordinate, MAP_USER_LOCATION_REGION_DELTA);
    },
    [
      blurSearch,
      centerMapOnCoordinate,
      getCurrentUserCoordinate,
      userLocationCoordinate,
    ],
  );

  return {
    activeFilterIds,
    mapRef,
    markers,
    onFloatingActionPress,
    onFilterPress,
    onMapPress,
    onMapReady,
    onMarkerPress,
    onPlaceSelected,
    onUserLocationChange,
    searchBarRef,
    showsUserLocation,
  };
}
