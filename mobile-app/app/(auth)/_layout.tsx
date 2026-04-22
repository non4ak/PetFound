import { Redirect, Stack } from 'expo-router';

import { FullscreenLoader } from '@/components/ui/FullscreenLoader';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated, isInitializing, isOnboardingActive } = useAuth();

  if (isInitializing) {
    return <FullscreenLoader />;
  }

  if (isAuthenticated) {
    return <Redirect href={isOnboardingActive ? '/(onboarding)/profile' : '/(tabs)'} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
