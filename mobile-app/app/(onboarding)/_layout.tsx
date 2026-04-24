import { Redirect, Stack, usePathname } from 'expo-router';

import { FullscreenLoader } from '@/components/ui/FullscreenLoader';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingLayout() {
  const pathname = usePathname();
  const { isAuthenticated, isInitializing, isOnboardingActive } = useAuth();
  const isConfirmEmailScreen: boolean = pathname === '/confirm-email';

  if (isInitializing) {
    return <FullscreenLoader />;
  }

  if (isConfirmEmailScreen) {
    if (isAuthenticated) {
      return <Redirect href={isOnboardingActive ? '/(onboarding)/profile' : '/(tabs)'} />;
    }

    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="confirm-email" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="location" />
        <Stack.Screen name="pet" />
        <Stack.Screen name="stay-in-loop" />
        <Stack.Screen name="all-set" />
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={isOnboardingActive ? '/(auth)/login' : '/(auth)/welcome'} />;
  }

  if (!isOnboardingActive) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="confirm-email" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="location" />
      <Stack.Screen name="pet" />
      <Stack.Screen name="stay-in-loop" />
      <Stack.Screen name="all-set" />
    </Stack>
  );
}
