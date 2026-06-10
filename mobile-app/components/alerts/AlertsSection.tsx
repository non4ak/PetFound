import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, ListRenderItem, View } from "react-native";

import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertsFallback } from "@/components/alerts/AlertsFallback";
import { Typography } from "@/components/ui/Typography";
import { useGetAlerts } from "@/data/hooks/alerts";
import type { Notification } from "@/types/alerts";

export function AlertsSection() {
  const router = useRouter();
  const {
    data: alertsData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetAlerts();

  const renderItem: ListRenderItem<Notification> = useCallback(
    ({ item }: { item: Notification }) => {
      if (item.match === null) {
        return <AlertCard item={item} onPress={undefined} />;
      }

      const oppositeAnnouncementId: number =
        item.match.oppositeAnnouncementId;

      return (
        <AlertCard
          item={item}
          onPress={(): void =>
            router.push(`/pet/${oppositeAnnouncementId}`)
          }
        />
      );
    },
    [router],
  );

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F2C94C" size="large" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Ionicons name="alert-circle-outline" size={48} color="#D95068" />
          <Typography
            className="text-center text-secondary-text"
            variant="body-small"
          >
            Failed to load announcements. Pull to retry.
          </Typography>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={alertsData?.items ?? []}
          keyExtractor={(item: Notification): string => String(item.id)}
          ListEmptyComponent={<AlertsFallback />}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
