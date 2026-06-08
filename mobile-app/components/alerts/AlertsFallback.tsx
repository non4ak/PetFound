import { View } from "react-native";
import { Typography } from "@/components/ui/Typography";

export function AlertsFallback() {
  return (
    <View className="mt-10 rounded-[28px] bg-foreground-background p-6">
      <Typography variant="title-small">No alerts yet</Typography>
      <Typography variant="body-small" className="mt-2 text-neutral-400">
        When someone comments, reports a possible match, or posts nearby, your
        updates will appear here.
      </Typography>
    </View>
  );
}
