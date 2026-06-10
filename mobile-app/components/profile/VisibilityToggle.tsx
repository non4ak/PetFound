import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

interface VisibilityToggleProps {
  isPublic: boolean;
  onPress?: () => void;
}

export function VisibilityToggle({
  isPublic,
  onPress,
}: VisibilityToggleProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <View className="items-center">
      <Typography
        variant="body-small"
        className="mb-1 text-[12px] leading-[14px] text-secondary-text"
      >
        public
      </Typography>
      <Container
        {...(onPress
          ? {
              activeOpacity: 0.85,
              onPress,
            }
          : {})}
        className="h-[28px] w-[44px] rounded-[8px] border border-[#BDBDBD] bg-white px-[3px] py-[3px]"
      >
        <View
          className={`h-5 w-5 rounded-full ${
            isPublic ? "self-start bg-primary" : "self-end bg-[#CFCFCF]"
          }`}
        />
      </Container>
    </View>
  );
}
