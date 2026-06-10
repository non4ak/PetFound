import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/Typography";
import { MatchesSection } from "@/components/alerts/MatchesSection";
import { AlertsSection } from "@/components/alerts/AlertsSection";

type ViewModeType = "matches" | "alerts";

export default function AlertsScreen() {
  const router = useRouter();
  const { view } = useLocalSearchParams<{ view?: string }>();
  const [viewMode, setViewMode] = useState<ViewModeType>(
    view === "alerts" ? "alerts" : "matches",
  );

  useEffect(() => {
    if (view === "matches" || view === "alerts") {
      setViewMode(view);
    }
  }, [view]);

  const handleChangeViewMode = (mode: ViewModeType): void => {
    setViewMode(mode);
    router.setParams({ view: mode });
  };

  const content =
    viewMode === "matches" ? <MatchesSection /> : <AlertsSection />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-6 gap-4">
        <Typography variant="title-large">Alerts</Typography>

        <View className="mt-4 flex flex-row rounded-full bg-foreground-background p-1">
          <Pressable
            onPress={() => handleChangeViewMode("matches")}
            className={`flex-1 rounded-l-full p-3 ${
              viewMode === "matches" ? "bg-primary" : "bg-transparent"
            }`}
          >
            <Typography
              variant="title-small"
              className={`text-center ${viewMode === "matches" ? "text-white" : "text-slate-600"}`}
            >
              Matches
            </Typography>
          </Pressable>

          <Pressable
            onPress={() => handleChangeViewMode("alerts")}
            className={`flex-1 rounded-r-full p-3 ${
              viewMode === "alerts" ? "bg-primary" : "bg-transparent"
            }`}
          >
            <Typography
              variant="title-small"
              className={`text-center ${viewMode === "alerts" ? "text-white" : "text-slate-600"}`}
            >
              Alerts
            </Typography>
          </Pressable>
        </View>

        {content}
      </View>
    </SafeAreaView>
  );
}
