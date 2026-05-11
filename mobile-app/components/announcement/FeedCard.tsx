import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Typography } from "@/components/ui/Typography";
import type { Announcement } from "@/types/announcement";

interface FeedCardProps {
  item: Announcement;
  onPress: () => void;
}

const STATUS_STYLES: Record<number, { bgClass: string; label: string; textClass: string }> = {
  0: { bgClass: "bg-[#FFDCE1]", label: "LOST", textClass: "text-[#D95068]" },
  1: { bgClass: "bg-[#D4EDDA]", label: "FOUND", textClass: "text-[#28A745]" },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function FeedCard({ item, onPress }: FeedCardProps) {
  const status = STATUS_STYLES[item.petStatus] ?? STATUS_STYLES[0];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mb-3 rounded-[16px] border border-[#E6EAF0] bg-white p-4"
    >
      <View className="flex-row gap-3">
        <View className="h-20 w-20 overflow-hidden rounded-[12px] border-2 border-primary bg-[#F5F5F5]">
          {item.petPhotoUrl ? (
            <Image
              source={{ uri: item.petPhotoUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="paw-outline" size={28} color="#C4C4C4" />
            </View>
          )}
        </View>

        <View className="flex-1 justify-between">
          <View className="flex-row items-start justify-between gap-2">
            <Typography
              variant="body-medium"
              className="flex-1 font-semibold text-heading-text"
              numberOfLines={1}
            >
              {item.petTypeLabel}
            </Typography>
            <View className={`rounded-full px-3 py-0.5 ${status.bgClass}`}>
              <Typography
                variant="body-small"
                className={`text-[13px] font-semibold ${status.textClass}`}
              >
                {status.label}
              </Typography>
            </View>
          </View>

          <View className="mt-1 flex-row items-center gap-1">
            <Ionicons name="location-outline" size={14} color="#8D8D8D" />
            <Typography
              variant="body-small"
              className="text-[14px] text-secondary-text"
              numberOfLines={1}
            >
              {item.city}, {item.country}
            </Typography>
          </View>

          <View className="mt-1 flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={14} color="#8D8D8D" />
            <Typography variant="body-small" className="text-[14px] text-secondary-text">
              {formatDate(item.lastDateWhenSeen)}
            </Typography>
          </View>
        </View>
      </View>

      {item.petDetails?.trim().length > 0 && (
        <Typography
          variant="body-small"
          className="mt-3 text-[14px] text-secondary-text"
          numberOfLines={2}
        >
          {item.petDetails}
        </Typography>
      )}
    </TouchableOpacity>
  );
}
