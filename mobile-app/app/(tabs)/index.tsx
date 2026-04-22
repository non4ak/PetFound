import { startTransition } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCreateAnnouncementPress = (): void => {
    startTransition(() => {
      router.push("/create-announcement");
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-alt-bg">
      <View className="flex-1 px-6 py-6">
        <View className="gap-3">
          <Typography variant="title-large">Feed</Typography>
          <Typography variant="body-small" className="text-neutral-400">
            Welcome back, {user?.userName ?? "friend"}. Recent lost and found
            activity will appear here.
          </Typography>
        </View>
      </View>
    </SafeAreaView>
  );
}
