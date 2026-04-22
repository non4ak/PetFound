import React, { type ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import type { AnnouncementDetails, AnnouncementType } from "@/types/announcement";

import { PreviewBadge } from "./PreviewBadge";

interface AnnouncementPreviewCardProps {
  badges: string[];
  children: ReactNode;
  details: AnnouncementDetails;
  title: string;
  type: AnnouncementType;
}

const STATUS_STYLES: Record<
  AnnouncementType,
  { bgClass: string; label: string; textClass: string }
> = {
  found: {
    bgClass: "bg-[#D4EDDA]",
    label: "FOUND",
    textClass: "text-[#28A745]",
  },
  lost: {
    bgClass: "bg-[#FFDCE1]",
    label: "LOST",
    textClass: "text-[#D95068]",
  },
};

export function AnnouncementPreviewCard({
  badges,
  children,
  details,
  title,
  type,
}: AnnouncementPreviewCardProps) {
  const status = STATUS_STYLES[type];

  return (
    <View className="mt-4 rounded-[20px] border border-[#E6EAF0] bg-white p-4">
      {children}

      <View className="mt-4 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Typography
            variant="title-small"
            className="font-semibold text-heading-text"
          >
            {title}
          </Typography>
        </View>
        <View className={`rounded-full px-3 py-1 ${status.bgClass}`}>
          <Typography
            variant="body-small"
            className={`font-semibold ${status.textClass}`}
          >
            {status.label}
          </Typography>
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        {badges.map((badge: string) => (
          <PreviewBadge key={badge} label={badge} />
        ))}
      </View>

      <View className="mt-4 flex-row items-center justify-between gap-4">
        <View className="flex-1 flex-row items-center gap-2">
          <Ionicons name="location-outline" size={16} color="#1E1E1E" />
          <Typography variant="body-small" className="text-heading-text">
            {details.city}, {details.country}
          </Typography>
        </View>
        <TouchableOpacity>
          <Typography variant="body-small" className="text-primary">
            Open map
          </Typography>
        </TouchableOpacity>
      </View>

      {details.dateLastSeen.trim().length > 0 && (
        <View className="mt-3 flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={16} color="#1E1E1E" />
          <Typography variant="body-small" className="text-heading-text">
            {details.timeApproximate.trim().length > 0
              ? `${details.dateLastSeen}, approx. ${details.timeApproximate}`
              : details.dateLastSeen}
          </Typography>
        </View>
      )}

      {details.description.trim().length > 0 && (
        <View className="mt-4 rounded-[14px] border border-[#E5E7EB] px-4 py-3">
          <Typography variant="body-small" className="text-heading-text">
            {details.description}
          </Typography>
        </View>
      )}

      <View className="mt-4 flex-row gap-3">
        {details.showPhone && (
          <View className="flex-1">
            <Button
              fullWidth
              label="Phone number"
              onPress={() => {}}
              size="sm"
              variant="outline"
            />
          </View>
        )}
        {details.showTelegram && (
          <View className="flex-1">
            <Button
              fullWidth
              label="Telegram"
              onPress={() => {}}
              size="sm"
              variant="outline"
            />
          </View>
        )}
      </View>
    </View>
  );
}
