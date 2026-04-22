import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/Typography";

interface AnnouncementModeCardProps {
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  title: string;
  type: "lost" | "found";
}

function AnnouncementModeCard({
  description,
  icon,
  title,
  type,
  onPress,
}: AnnouncementModeCardProps) {
  return (
    <TouchableOpacity className="flex-1" onPress={onPress} activeOpacity={0.7}>
      <View
        className={`h-full rounded-[24px] bg-foreground-background p-5 items-center justify-center border-2 ${
          type === "lost" ? "border-red-500" : "border-green-500"
      ***REMOVED***`}
      >
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFF3DA]">
          <Ionicons name={icon} size={22} color="#D89F35" />
        </View>
        <Typography variant="title-small" className="mt-4">
          {title}
        </Typography>
        <Typography
          variant="body-small"
          className="mt-2 text-secondary-text text-center "
        >
          {description}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

export default function CreateAnnouncementScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7EA]">
      <View className="flex-1 px-6 py-4">
        <TouchableOpacity
          className="h-11 w-11 items-center justify-center rounded-full bg-foreground-background"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#1E1E1E" />
        </TouchableOpacity>

        <View className="mt-6">
          <Typography variant="title-large">Create announcement</Typography>
        </View>

        <View className="flex-1 mt-8 gap-8 py-10">
          <AnnouncementModeCard
            description="Post so the community can help find your pet. You'll use your registered pet card or fill in details from scratch."
            icon="search-outline"
            title="My pet is lost"
            type="lost"
            onPress={() => router.push("/lost-pet")}
          />
          <AnnouncementModeCard
            description="Share where the pet was found so the owner can identify and contact you."
            icon="heart-outline"
            title="I found a pet"
            type="found"
            onPress={() => {
              router.push("/found-pet");
          ***REMOVED***}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
