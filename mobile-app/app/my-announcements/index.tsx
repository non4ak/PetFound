import React, { useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { FeedCard } from "@/components/announcement/FeedCard";
import { Typography } from "@/components/ui/Typography";
import { useGetMyAnnouncements } from "@/data/hooks/announcements";
import type { Announcement } from "@/types/announcement";

type FilterTab = "all" | "active" | "archived";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "archived", label: "Archived" },
];

function filterByTab(items: Announcement[], tab: FilterTab): Announcement[] {
  if (tab === "active") return items.filter((a) => a.isActive);
  if (tab === "archived") return items.filter((a) => !a.isActive);
  return items;
}

export default function MyAnnouncementsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const { data, isLoading } = useGetMyAnnouncements({ pageSize: 100 });
  const items = data?.items ?? [];
  const filtered = filterByTab(items, activeTab);

  return (
    <SafeAreaView className="flex-1 bg-[#FFF5E2]">
      <View className="mx-6 flex-row items-center justify-between rounded-b-[16px] bg-white px-5 py-4">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
          onPress={() => router.back()}
        >
          <Ionicons color="#94A3B8" name="arrow-back" size={20} />
        </TouchableOpacity>
        <Typography
          className="font-semibold text-heading-text"
          variant="body-regular"
        >
          My announcements
        </Typography>
        <View className="h-10 w-10" />
      </View>

      {/* Filter tabs */}
      <View className="mx-6 mt-3 flex-row gap-2">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className="rounded-full px-5 py-2"
            style={{
              backgroundColor: activeTab === tab.key ? "#F2C94C" : "#FFFFFF",
            }}
          >
            <Typography
              variant="body-small"
              className={activeTab === tab.key ? "font-bold text-heading-text" : "text-secondary-text"}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F2C94C" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Typography
            className="text-center text-secondary-text"
            variant="body-regular"
          >
            No announcements yet.
          </Typography>
        </View>
      ) : (
        <FlatList
          data={filtered}
          contentContainerStyle={{ padding: 24, paddingTop: 12 }}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              {!item.isActive && (
                <View className="mb-1 self-start rounded-[6px] bg-[#E5E7EB] px-3 py-0.5">
                  <Typography variant="body-small" className="font-bold text-secondary-text">
                    Archived
                  </Typography>
                </View>
              )}
              <FeedCard
                item={item}
                onPress={() =>
                  router.push({ pathname: "/pet/[id]", params: { id: item.id, mine: "1" } })
                }
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
