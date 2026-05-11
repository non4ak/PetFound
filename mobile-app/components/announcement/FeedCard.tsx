import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Typography } from "@/components/ui/Typography";
import type { Announcement } from "@/types/announcement";

interface FeedCardProps {
  item: Announcement;
  onPress: () => void;
}

const STATUS_STYLES: Record<number, { bg: string; text: string; label: string }> = {
  0: { bg: "bg-[#FFE1E2]", text: "text-[#FF4853]", label: "LOST" },
  1: { bg: "bg-[#D2DBFF]", text: "text-[#5330FF]", label: "FOUND" },
};

const PET_EMOJI: Record<number, string> = {
  0: "🐱",
  1: "🐕",
};

function formatDate(dateStr: string, approxTime?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const base = `${day}/${month}/${year}`;
  return approxTime?.trim() ? `${base}, ${approxTime.trim()}` : base;
}

export function FeedCard({ item, onPress }: FeedCardProps) {
  const status = STATUS_STYLES[item.petStatus] ?? STATUS_STYLES[0];
  const emoji = PET_EMOJI[item.petType] ?? "🐾";

  const title = item.petName?.trim().length > 0 ? item.petName : item.petTypeLabel;

  const subtitle = [item.breed, item.petSexLabel, item.petSizeLabel]
    .filter((s) => s && s.trim().length > 0 && s !== "Unknown")
    .join(" · ");

  const location = [item.nearLandmark, item.city]
    .filter((s) => s && s.trim().length > 0)
    .join(", ");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mb-3 rounded-[8px] bg-white p-4"
      style={{
        shadowColor: "#F2B84C",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 3,
    ***REMOVED***}
    >
      <View className="flex-row gap-3">
        {/* Pet photo */}
        <View className="h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[8px] border-2 border-primary bg-background">
          {item.petPhotoUrl ? (
            <Image
              source={{ uri: item.petPhotoUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <Text style={{ fontSize: 48 }}>{emoji}</Text>
          )}
        </View>

        {/* Info */}
        <View className="flex-1 justify-center gap-1">
          <Typography
            variant="body-medium"
            className="font-semibold text-[20px] text-heading-text"
            numberOfLines={1}
          >
            {title}
          </Typography>

          {subtitle.length > 0 && (
            <Typography
              variant="body-small"
              className="text-secondary-text"
              numberOfLines={1}
            >
              {subtitle}
            </Typography>
          )}

          <View className="mt-1 flex-row items-center gap-1">
            <Ionicons name="location-outline" size={14} color="#8D8D8D" />
            <Typography
              variant="body-small"
              className="flex-1 text-secondary-text"
              numberOfLines={1}
            >
              {location}
            </Typography>
          </View>

          <Typography variant="body-small" className="text-secondary-text">
            {formatDate(item.lastDateWhenSeen, item.approximateTime)}
          </Typography>
        </View>
      </View>

      {/* Bottom row */}
      <View className="mt-3 flex-row items-center justify-between">
        <Typography variant="body-small" className="font-bold text-secondary-text">
          Comments (0)
        </Typography>
        <View className={`rounded-[8px] px-4 py-1 ${status.bg}`}>
          <Typography
            variant="body-small"
            className={`font-bold ${status.text}`}
          >
            {status.label}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
}
