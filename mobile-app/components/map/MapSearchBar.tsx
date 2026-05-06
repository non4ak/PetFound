import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { mapStyles } from "./map.styles";

interface MapSearchBarProps {
  onSearchQueryChange: (value: string) => void;
  searchQuery: string;
}

export function MapSearchBar({
  onSearchQueryChange,
  searchQuery,
}: MapSearchBarProps): React.JSX.Element {
  return (
    <View
      className="mx-4 flex-row items-center rounded-full bg-white px-4 py-3"
      style={mapStyles.searchBar}
    >
      <Ionicons className="mr-2" color="#8e8e93" name="search" size={20} />
      <TextInput
        className="flex-1 p-0 text-base text-black"
        onChangeText={onSearchQueryChange}
        placeholder="Search area..."
        placeholderTextColor="#8e8e93"
        value={searchQuery}
      />
      <TouchableOpacity
        accessibilityLabel="Search by voice"
        activeOpacity={0.8}
      >
        <Ionicons color="#8e8e93" name="mic-outline" size={20} />
      </TouchableOpacity>
    </View>
  );
}
