import React from "react";
import { Switch, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

interface ContactPreferenceRowProps {
  onChange: (value: boolean) => void;
  title: string;
  value: boolean;
}

export function ContactPreferenceRow({
  onChange,
  title,
  value,
}: ContactPreferenceRowProps) {
  return (
    <View className="rounded-[12px] border border-[#BFC9D6] bg-[#EEF4FB] px-4 py-3">
      <View className="flex-row items-center justify-between gap-4">
        <Typography
          variant="body-small"
          className="font-semibold text-heading-text"
        >
          {title}
        </Typography>
        <Switch
          onValueChange={onChange}
          thumbColor="#FDFDFD"
          trackColor={{ false: "#C7C7CC", true: "#F2C94C" }}
          value={value}
        />
      </View>
    </View>
  );
}
