import React from "react";
import { View } from "react-native";

import { Typography } from "@/components/ui/Typography";

export function PreviewBadge({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-[#BFC9D6] bg-[#EEF4FB] px-3 py-1">
      <Typography variant="body-small" className="text-heading-text">
        {label}
      </Typography>
    </View>
  );
}
