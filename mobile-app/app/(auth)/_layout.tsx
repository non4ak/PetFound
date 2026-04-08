import { Redirect, Stack } from 'expo-router';

import { FullscreenLoader } from '@/components/ui/FullscreenLoader';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <FullscreenLoader />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
