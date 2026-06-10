import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GooglePlacesAutocomplete,
  type GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";

import type { MapPlaceLocation } from "@/types/map.types";

interface MapSearchBarProps {
  onPlaceSelected: (location: MapPlaceLocation | null) => void;
}

interface GooglePlacesApiLocation {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

interface GooglePlacesApiDetails {
  geometry?: {
    location?: GooglePlacesApiLocation;
  };
  location?: GooglePlacesApiLocation;
}

export interface MapSearchBarRef {
  blur: () => void;
  clear: () => void;
}

const GOOGLE_PLACES_API_BASE_URL: string = "https://places.googleapis.com";
const GOOGLE_PLACES_AUTOCOMPLETE_FIELD_MASK: string =
  "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat";
const GOOGLE_PLACES_DETAILS_FIELDS: string =
  "id,displayName,formattedAddress,location";

const SEARCH_BAR_STYLES = {
  container: {
    flex: 0,
    width: "100%",
  },
  textInputContainer: {
    backgroundColor: "white",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 16,
    color: "#000",
    marginBottom: 0,
    padding: 0,
    height: 40,
    flex: 1,
  },
  listView: {
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    padding: 13,
    height: 44,
    flexDirection: "row" as const,
  },
} as const;

function mapGooglePlacesLocationToMapPlaceLocation(
  location: GooglePlacesApiLocation | undefined,
): MapPlaceLocation | null {
  if (location === undefined) {
    return null;
  }

  const latitude: number | undefined = location.latitude ?? location.lat;
  const longitude: number | undefined = location.longitude ?? location.lng;

  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  return {
    lat: latitude,
    lng: longitude,
  };
}

function getMapPlaceLocationFromDetails(
  details: GooglePlacesApiDetails | null,
): MapPlaceLocation | null {
  if (details === null) {
    return null;
  }

  return mapGooglePlacesLocationToMapPlaceLocation(
    details.location ?? details.geometry?.location,
  );
}

export const MapSearchBar = forwardRef<MapSearchBarRef, MapSearchBarProps>(
  function MapSearchBar(
    { onPlaceSelected }: MapSearchBarProps,
    ref,
  ): React.JSX.Element {
    const placesRef = useRef<GooglePlacesAutocompleteRef | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    const blurSearch = useCallback((): void => {
      placesRef.current?.blur();
      Keyboard.dismiss();
    }, []);

    const clearSearch = useCallback((): void => {
      placesRef.current?.setAddressText("");
      setSearchText("");
      onPlaceSelected(null);
    }, [onPlaceSelected]);

    useImperativeHandle(
      ref,
      (): MapSearchBarRef => ({
        blur: blurSearch,
        clear: clearSearch,
      }),
      [blurSearch, clearSearch],
    );

    return (
      <View className="mx-4">
        <GooglePlacesAutocomplete
          fetchDetails={true}
          fields={GOOGLE_PLACES_DETAILS_FIELDS}
          isNewPlacesAPI={true}
          keyboardShouldPersistTaps="always"
          onFail={(error: unknown): void => {
            console.warn("Google Places autocomplete failed", error);
          }}
          onPress={(_data, details = null) => {
            onPlaceSelected(getMapPlaceLocationFromDetails(details));
          }}
          placeholder="Search area..."
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
            languageCode: "en",
          }}
          ref={placesRef}
          requestUrl={{
            headers: {
              "Content-Type": "application/json",
              "X-Goog-FieldMask": GOOGLE_PLACES_AUTOCOMPLETE_FIELD_MASK,
            },
            url: GOOGLE_PLACES_API_BASE_URL,
            useOnPlatform: "all",
          }}
          renderLeftButton={() => (
            <Ionicons
              className="mr-2 self-center"
              color="#8e8e93"
              name="search"
              size={20}
            />
          )}
          renderRightButton={() =>
            searchText.trim().length > 0 ? (
              <TouchableOpacity
                accessibilityLabel="Clear map search"
                activeOpacity={0.75}
                className="h-10 w-10 items-center justify-center"
                onPress={clearSearch}
              >
                <Ionicons color="#8e8e93" name="close-circle" size={20} />
              </TouchableOpacity>
            ) : null
          }
          styles={SEARCH_BAR_STYLES}
          textInputProps={{
            onChangeText: setSearchText,
            onBlur: () =>
              setSearchText(placesRef.current?.getAddressText() ?? ""),
          }}
        />
      </View>
    );
  },
);
