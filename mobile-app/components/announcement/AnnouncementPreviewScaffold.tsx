import React, { type ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

interface AnnouncementPreviewScaffoldProps {
  children: ReactNode;
  isPosting: boolean;
  onBackPress: () => void;
  onPostPress: () => void;
}

export function AnnouncementPreviewScaffold({
  children,
  isPosting,
  onBackPress,
  onPostPress,
}: AnnouncementPreviewScaffoldProps): React.JSX.Element {
  const postLabel: string = isPosting ? "Posting..." : "Post";

  return (
    <AppScreenScaffold
      footer={
        <Button
          fullWidth
          disabled={isPosting}
          label={postLabel}
          onPress={onPostPress}
          size="md"
          trailingIcon={
            <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
        ***REMOVED***
          variant="primary"
        />
    ***REMOVED***
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={onBackPress}
          >
            <Ionicons name="arrow-back" size={20} color="#94A3B8" />
          </TouchableOpacity>
          <Typography
            variant="body-regular"
            className="font-semibold text-heading-text"
          >
            Preview
          </Typography>
          <TouchableOpacity disabled={isPosting} onPress={onPostPress}>
            <Typography variant="body-small" className="text-primary">
              {postLabel}
            </Typography>
          </TouchableOpacity>
        </View>
    ***REMOVED***
    >
      <Typography variant="body-small" className="text-secondary-text">
        How your post will look in the feed
      </Typography>

      {children}
    </AppScreenScaffold>
  );
}
