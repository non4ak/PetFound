import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface MapSearchBarProps {
  onPlaceSelected: (location: { lat: number; lng: number } | null) => void;
}

const SEARCH_BAR_STYLES = {
  container: {
    flex: 0,
    width: "100%",
***REMOVED***,
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
***REMOVED***,
  textInput: {
    backgroundColor: "transparent",
    fontSize: 16,
    color: "#000",
    marginBottom: 0,
    padding: 0,
    height: 40,
    flex: 1,
***REMOVED***,
  listView: {
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
***REMOVED***,
  row: {
    padding: 13,
    height: 44,
    flexDirection: "row" as const,
***REMOVED***,
};

export function MapSearchBar({
  onPlaceSelected,
}: MapSearchBarProps): React.JSX.Element {
  return (
    <View className="mx-4">
      <GooglePlacesAutocomplete
        fetchDetails={true}
        keyboardShouldPersistTaps="always"
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            onPlaceSelected(details.geometry.location);
        ***REMOVED*** else {
            onPlaceSelected(null);
        ***REMOVED***
      ***REMOVED***}
        placeholder="Search area..."
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: "en",
      ***REMOVED***}
        renderLeftButton={() => (
          <Ionicons
            className="mr-2 self-center"
            color="#8e8e93"
            name="search"
            size={20}
          />
        )}
        styles={SEARCH_BAR_STYLES}
      />
    </View>
  );
}
