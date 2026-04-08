import { startTransition } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await logout();

    startTransition(() => {
      router.replace('/(auth)/welcome');
  ***REMOVED***);
***REMOVED***;

  return (
    <SafeAreaView className="flex-1 bg-alt-bg">
      <View className="flex-1 px-8 py-10">
        <View className="gap-3">
          <Typography variant="title-large">
            Welcome home,{'\n'}
            {user?.userName ?? 'friend'}
          </Typography>
          <Typography variant="body-regular">
            You are signed in as {user?.email ?? 'unknown'}.
          </Typography>
          <Typography variant="body-small" className="text-neutral-400">
            Role: {user?.role ?? 'unknown'}
          </Typography>
        </View>

        <View className="mt-8 rounded-[24px] bg-foreground-background p-6">
          <Typography variant="body-regular">
            Mobile auth is active. Your access token is attached to API requests and your refresh
            token is stored locally for session recovery.
          </Typography>
        </View>

        <View className="flex-1" />

        <Button
          fullWidth
          label="Log Out"
          onPress={handleLogout}
          size="lg"
          variant="secondary"
        />
      </View>
    </SafeAreaView>
  );
}
