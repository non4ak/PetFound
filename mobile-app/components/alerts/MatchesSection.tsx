import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, View } from "react-native";

import { MatchAnnouncementCard } from "@/components/alerts/MatchAnnouncementCard";
import { Typography } from "@/components/ui/Typography";
import { useGetMatches } from "@/data/hooks/matches";
import type { MatchResult } from "@/types/match";

const PAGE_SIZE = 20;

export function MatchesSection() {
  const router = useRouter();
  const query = {
    pageNumber: 0,
    pageSize: PAGE_SIZE,
  };
  const { data, isError, isLoading, isRefetching, refetch } =
    useGetMatches(query);

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
            Failed to load matches. Pull to retry.
          </Typography>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={data?.items ?? []}
          keyExtractor={(item: MatchResult): string => String(item.id)}
          ListEmptyComponent={
            <View className="mt-16 items-center gap-3">
              <Ionicons name="git-compare-outline" size={48} color="#C4C4C4" />
              <Typography
                className="text-center text-secondary-text"
                variant="body-small"
              >
                No matches found for this status.
              </Typography>
            </View>
          }
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }: { item: MatchResult }) => (
            <MatchAnnouncementCard
              item={item}
              onPress={(): void =>
                router.push(`/pet/${item.oppositeAnnouncementId}`)
              }
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
