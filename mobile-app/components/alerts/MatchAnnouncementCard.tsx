import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import type { MatchResult } from "@/types/match";
import { MatchResultStatus } from "@/types/match";

interface MatchAnnouncementCardProps {
  item: MatchResult;
  onPress: () => void;
}

interface BadgeStyle {
  backgroundClassName: string;
  textClassName: string;
}

const MATCH_STATUS_STYLES: Record<MatchResultStatus, BadgeStyle> = {
  [MatchResultStatus.Pending]: {
    backgroundClassName: "bg-[#FFF1C7]",
    textClassName: "text-[#8A6414]",
***REMOVED***,
  [MatchResultStatus.Rejected]: {
    backgroundClassName: "bg-[#FFE1E2]",
    textClassName: "text-[#D95068]",
***REMOVED***,
  [MatchResultStatus.Approved]: {
    backgroundClassName: "bg-[#DDF5E7]",
    textClassName: "text-[#237A4B]",
***REMOVED***,
};

const PET_STATUS_STYLES: Record<number, BadgeStyle> = {
  0: {
    backgroundClassName: "bg-[#FFE1E2]",
    textClassName: "text-[#FF4853]",
***REMOVED***,
  1: {
    backgroundClassName: "bg-[#D2DBFF]",
    textClassName: "text-[#5330FF]",
***REMOVED***,
};

function getLocation(item: MatchResult): string {
  const locationParts: string[] = [
    item.oppositeAnnouncement.city,
    item.oppositeAnnouncement.country,
  ].filter((value: string | null): value is string => {
    return typeof value === "string" && value.trim().length > 0;
***REMOVED***);

  return locationParts.join(", ");
}

function formatSimilarity(value: number): string {
  return `${Math.round(value)}% match`;
}

export function MatchAnnouncementCard({
  item,
  onPress,
}: MatchAnnouncementCardProps) {
  const announcement = item.oppositeAnnouncement;
  const matchStatusStyle = MATCH_STATUS_STYLES[item.status];
  const petStatusStyle =
    PET_STATUS_STYLES[announcement.petStatus] ?? PET_STATUS_STYLES[0];
  const location = getLocation(item);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="mb-3 rounded-[8px] bg-white p-4"
      onPress={onPress}
      style={{
        elevation: 3,
        shadowColor: "#F2B84C",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    ***REMOVED***}
    >
      <View className="flex-row gap-3">
        <View className="h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[8px] border-2 border-primary bg-background">
          {announcement.petPhotoUrl ? (
            <Image
              className="h-full w-full"
              resizeMode="cover"
              source={{ uri: announcement.petPhotoUrl }}
            />
          ) : (
            <Ionicons name="paw-outline" size={44} color="#8D8D8D" />
          )}
        </View>

        <View className="flex-1 justify-center gap-2">
          <Typography
            className="font-semibold text-[20px] text-heading-text"
            numberOfLines={1}
            variant="body-medium"
          >
            {announcement.petName}
          </Typography>

          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={14} color="#8D8D8D" />
            <Typography
              className="flex-1 text-secondary-text"
              numberOfLines={1}
              variant="body-small"
            >
              {location || "Location unavailable"}
            </Typography>
          </View>

          <Typography className="font-bold text-[#8A6414]" variant="body-small">
            {formatSimilarity(item.similarityPercentage)}
          </Typography>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-2">
        <View
          className={`rounded-[8px] px-3 py-1 ${matchStatusStyle.backgroundClassName}`}
        >
          <Typography
            className={`font-bold ${matchStatusStyle.textClassName}`}
            variant="body-small"
          >
            {item.statusLabel.toUpperCase()}
          </Typography>
        </View>

        <View
          className={`rounded-[8px] px-4 py-1 ${petStatusStyle.backgroundClassName}`}
        >
          <Typography
            className={`font-bold ${petStatusStyle.textClassName}`}
            variant="body-small"
          >
            {announcement.petStatusLabel.toUpperCase()}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
}
