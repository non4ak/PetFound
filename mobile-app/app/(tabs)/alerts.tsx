import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/components/ui/Typography';

export default function AlertsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-alt-bg">
      <View className="flex-1 px-6 py-6">
        <Typography variant="title-large">Alerts</Typography>
        <Typography variant="body-small" className="mt-2 text-neutral-400">
          Stay updated on matches, nearby reports, and replies from the community.
        </Typography>

        <View className="mt-10 rounded-[28px] bg-foreground-background p-6">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#FFF3DA]">
            <Ionicons name="notifications-outline" size={28} color="#D89F35" />
          </View>
          <Typography variant="title-small" className="mt-5">
            No alerts yet
          </Typography>
          <Typography variant="body-small" className="mt-2 text-neutral-400">
            When someone comments, reports a possible match, or posts nearby, your updates will
            appear here.
          </Typography>
        </View>
      </View>
    </SafeAreaView>
  );
}
