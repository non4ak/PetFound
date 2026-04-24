import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function CreateAnnouncementTabButton({
  accessibilityState,
}: BottomTabBarButtonProps) {
  const router = useRouter();
  const isSelected: boolean = accessibilityState?.selected === true;

  const handlePress = (): void => {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  ***REMOVED***

    router.push("/create-announcement");
***REMOVED***;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      activeOpacity={0.9}
      className="flex-1 items-center justify-end"
      onPress={handlePress}
    >
      <View className="-mt-10 items-center">
        <View
          className="h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: "#F2C94C",
            shadowColor: "#D19A36",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.22,
            shadowRadius: 16,
            elevation: 10,
        ***REMOVED***}
        >
          <Ionicons name="add" size={28} color="#1E1E1E" />
        </View>
        <Text
          style={{
            color: isSelected ? "#D8A33E" : "#8F8F95",
            fontSize: 10,
            fontWeight: "500",
            marginTop: 4,
        ***REMOVED***}
        >
          Post
        </Text>
      </View>
    </TouchableOpacity>
  );
}
