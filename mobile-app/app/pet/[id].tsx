import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { PreviewBadge } from "@/components/announcement/PreviewBadge";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import type { PetMapMarkerType } from "@/types/map.types";
import { useGetAnnouncementById } from "@/data/hooks/announcements";

const STATUS_STYLES = {
  found: {
    backgroundColor: "#D4EDDA",
    label: "FOUND",
    textColor: "#28A745",
  },
  lost: {
    backgroundColor: "#FFDCE1",
    label: "LOST",
    textColor: "#D95068",
  },
};

export default function PetDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: announcementData, isLoading } = useGetAnnouncementById(
    Number(id),
  );

  const announcement = announcementData?.data;
  const petInfo = announcementData?.data?.pet;

  const handleBackPress = (): void => {
    router.back();
  };

  if (announcementData?.data === null) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF5E2] px-6">
        <TouchableOpacity
          className="mt-4 h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
          onPress={handleBackPress}
        >
          <Ionicons color="#94A3B8" name="arrow-back" size={20} />
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center">
          <Typography
            className="text-center font-semibold text-heading-text"
            variant="title-small"
          >
            Pet announcement was not found
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const status =
    STATUS_STYLES[announcement?.petStatus === 0 ? "lost" : "found"];

  return (
    <SafeAreaView className="flex-1 bg-[#FFF5E2]">
      <View className="mx-6 flex-row items-center justify-between rounded-b-[16px] bg-white px-5 py-4">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
          onPress={handleBackPress}
        >
          <Ionicons color="#94A3B8" name="arrow-back" size={20} />
        </TouchableOpacity>
        <Typography
          className="font-semibold text-heading-text"
          variant="body-regular"
        >
          Pet
        </Typography>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-3 bg-white px-4 pb-5 pt-3">
          <Image
            className="h-[160px] w-full rounded-[8px]"
            resizeMode="cover"
            source={{
              uri: petInfo?.petPhotoUrl?.startsWith("http")
                ? petInfo.petPhotoUrl
                : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop",
            }}
          />

          <View className="mt-4 flex-row items-center justify-between">
            <Typography
              className="font-semibold text-heading-text"
              variant="title-small"
            >
              {petInfo?.petName}
            </Typography>
            <View
              className="rounded-[6px] px-6 py-1"
              style={{ backgroundColor: status.backgroundColor }}
            >
              <Typography
                className="text-[12px] font-bold"
                style={{ color: status.textColor }}
                variant="body-small"
              >
                {status.label}
              </Typography>
            </View>
          </View>

          <View className="mt-3 flex-row flex-wrap gap-2">
            {petInfo?.petTypeLabel && (
              <PreviewBadge label={petInfo?.petTypeLabel} />
            )}
            {petInfo?.petSexLabel && petInfo?.petSexLabel !== "Unknown" && (
              <PreviewBadge label={petInfo?.petSexLabel} />
            )}
            {petInfo?.petSizeLabel && petInfo?.petSizeLabel !== "Unknown" && (
              <PreviewBadge label={petInfo?.petSizeLabel} />
            )}
            {petInfo?.petAgeCategoryLabel &&
              petInfo?.petAgeCategoryLabel !== "Unknown" && (
                <PreviewBadge label={petInfo?.petAgeCategoryLabel} />
              )}
          </View>

          <View className="mt-5 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-2">
              <Ionicons color="#111827" name="location-outline" size={17} />
              <Typography className="text-heading-text" variant="body-small">
                {[announcement?.nearLandmark, announcement?.city, announcement?.country]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            </View>
            <TouchableOpacity>
              <Typography
                className="font-medium text-primary"
                variant="body-small"
              >
                Open map
              </Typography>
            </TouchableOpacity>
          </View>

          <View className="mt-3 flex-row items-center gap-2">
            <Ionicons color="#111827" name="calendar-outline" size={17} />
            <Typography className="text-heading-text" variant="body-small">
              {announcement?.lastDateWhenSeen
                ? `${new Date(announcement.lastDateWhenSeen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}${announcement.approximateTime ? `, approx. ${announcement.approximateTime}` : ""}`
                : "Unknown date"}
            </Typography>
          </View>

          <View className="mt-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#BFC9D6]" />
            <Typography
              className="text-[12px] text-secondary-text"
              variant="body-small"
            >
              pet details
            </Typography>
            <View className="h-px flex-1 bg-[#BFC9D6]" />
          </View>

          <Typography
            className="mt-3 text-[13px] text-heading-text"
            variant="body-small"
          >
            {petInfo?.description}
          </Typography>

          <View className="mt-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#BFC9D6]" />
            <Typography
              className="text-[12px] text-secondary-text"
              variant="body-small"
            >
              announcement description
            </Typography>
            <View className="h-px flex-1 bg-[#BFC9D6]" />
          </View>

          <Typography
            className="mt-3 text-[13px] text-heading-text"
            variant="body-small"
          >
            {announcement?.petDetails}
          </Typography>

          <View className="mt-5 flex-row gap-3">
            <View className="flex-1">
              <Button
                fullWidth
                label="Phone number"
                size="sm"
                variant="outline"
              />
            </View>
            <View className="flex-1">
              <Button fullWidth label="Telegram" size="sm" variant="outline" />
            </View>
          </View>
        </View>

        <View className="border-t border-[#F4E8D0] bg-white px-4 py-5">
          <Typography
            className="font-semibold text-heading-text"
            variant="body-small"
          >
            Comments (0)
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
