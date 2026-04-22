import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AnnouncementPreviewCard } from "@/components/announcement/AnnouncementPreviewCard";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";
import { getPetSexLabel, getPetSizeLabel, getPetTypeLabel } from "@/utils/petLabels";

export default function FoundPetPreviewScreen() {
  const router = useRouter();
  const { details, info, resetDraft } = useFoundPetFlow();

  const handlePostPress = (): void => {
    resetDraft();
    router.replace("/(tabs)");
  };

  const badges: string[] = [getPetTypeLabel(info.petType)];
  if (info.breed.trim().length > 0) badges.push(info.breed);
  const sexLabel = getPetSexLabel(info.petSex);
  if (sexLabel !== null) badges.push(sexLabel);
  const sizeLabel = getPetSizeLabel(info.petSize);
  if (sizeLabel !== null) badges.push(sizeLabel);

  return (
    <AppScreenScaffold
      footer={
        <Button
          fullWidth
          label="Post"
          onPress={handlePostPress}
          size="md"
          trailingIcon={
            <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
          }
          variant="primary"
        />
      }
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#94A3B8" />
          </TouchableOpacity>
          <Typography
            variant="body-regular"
            className="font-semibold text-heading-text"
          >
            Preview
          </Typography>
          <TouchableOpacity onPress={handlePostPress}>
            <Typography variant="body-small" className="text-primary">
              Post
            </Typography>
          </TouchableOpacity>
        </View>
      }
    >
      <Typography variant="body-small" className="text-secondary-text">
        How your post will look in the feed
      </Typography>

      <AnnouncementPreviewCard
        badges={badges}
        details={details}
        title="Found pet"
        type="found"
      >
        <View className="h-[180px] w-full items-center justify-center rounded-[16px] bg-[#FFF7EA]">
          <Ionicons name="camera-outline" size={40} color="#D89F35" />
        </View>
      </AnnouncementPreviewCard>
    </AppScreenScaffold>
  );
}
