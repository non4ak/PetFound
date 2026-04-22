import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { CreateAnnouncementTabButton } from "@/components/navigation/CreateAnnouncementTabButton";
import { FullscreenLoader } from "@/components/ui/FullscreenLoader";
import { HapticTab } from "@/components/haptic-tab";
import { useAuth } from "@/contexts/AuthContext";

const TAB_ICON_SIZE = 24;

export default function TabLayout() {
  const { isAuthenticated, isInitializing, isOnboardingActive } = useAuth();

  if (isInitializing) {
    return <FullscreenLoader />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (isOnboardingActive) {
    return <Redirect href="/(onboarding)/profile" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#F2C94C",
        tabBarInactiveTintColor: "#8F8F95",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 18,
          height: 82,
          paddingBottom: 24,
          paddingTop: 6,
          shadowColor: "#171717",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarButton: (props) => <CreateAnnouncementTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
