import React, { type ReactNode } from "react";
import { View } from "react-native";

import { Typography } from "@/components/ui/Typography";

interface ProfileSectionCardProps {
  children: ReactNode;
  headerAction?: ReactNode;
  title: string;
}

export function ProfileSectionCard({
  children,
  headerAction,
  title,
}: ProfileSectionCardProps) {
  return (
    <View className="rounded-[18px] bg-white px-5 py-4">
      <View className="flex-row items-center justify-between">
        <Typography
          variant="body-medium"
          className="font-semibold uppercase tracking-[0.3px] text-heading-text"
        >
          {title}
        </Typography>
        {headerAction ?? null}
      </View>

      <View className="mt-3 border-t border-[#E8E8E8] pt-1">{children}</View>
    </View>
  );
}
