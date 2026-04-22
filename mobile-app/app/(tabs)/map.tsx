import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LostPetMap } from "@/components/map/LostPetMap";

const MAP_TAB_BAR_OFFSET = 96;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <View className="flex-1 bg-[#f2efe9]">
      <LostPetMap />

      <View
        className="absolute inset-x-0 top-0"
        pointerEvents="box-none"
        style={{ paddingTop: insets.top + 4 }}
      >
        <View
          className="mx-4 flex-row items-center rounded-full bg-white px-4 py-3"
          style={{
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
        ***REMOVED***}
        >
          <Ionicons className="mr-2" color="#8e8e93" name="search" size={20} />
          <TextInput
            className="flex-1 p-0 text-base text-black"
            placeholder="Search area..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity activeOpacity={0.8}>
            <Ionicons color="#8e8e93" name="mic-outline" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="pt-3"
          contentContainerClassName="gap-2 px-4 pb-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center rounded-full bg-[#f4c753] px-4 py-2"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
          ***REMOVED***}
          >
            <Ionicons
              className="mr-1"
              color="#000"
              name="options-outline"
              size={16}
            />
            <Text className="text-sm font-semibold text-black">Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-full bg-white px-4 py-2"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
          ***REMOVED***}
          >
            <Text className="text-sm font-medium text-black">Lost</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-full bg-white px-4 py-2"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
          ***REMOVED***}
          >
            <Text className="text-sm font-medium text-black">Found</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center rounded-full bg-white px-4 py-2"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
          ***REMOVED***}
          >
            <Text className="text-sm font-medium text-black">Species</Text>
            <Ionicons
              className="ml-1"
              color="#000"
              name="chevron-down"
              size={14}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View
        className="absolute right-4 gap-3"
        pointerEvents="box-none"
        style={{ bottom: insets.bottom + MAP_TAB_BAR_OFFSET }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          className="h-12 w-12 items-center justify-center rounded-full bg-white"
          style={{
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        ***REMOVED***}
        >
          <MaterialIcons color="#000" name="my-location" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          className="h-12 w-12 items-center justify-center rounded-full bg-white"
          style={{
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        ***REMOVED***}
        >
          <MaterialIcons color="#000" name="layers" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
