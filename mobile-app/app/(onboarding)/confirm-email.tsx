import React, { startTransition, useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLoginMutation } from '@/data/hooks/auth';
import { getApiErrorMessage } from '@/utils/apiError';

export default function ConfirmEmailScreen() {
  const auth = useAuth();
  const { clearOnboardingDraft } = useOnboarding();
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const resetRegistrationFlow = async (): Promise<void> => {
    auth.clearPendingEmailConfirmation();
    clearOnboardingDraft();
    await auth.finishOnboarding();
    router.replace('/(auth)/signup');
***REMOVED***;

  const handleBackPress = (): void => {
    void resetRegistrationFlow();
***REMOVED***;

  const handlePrimaryActionPress = async (): Promise<void> => {
    const pendingEmailConfirmation = auth.pendingEmailConfirmation;

    if (pendingEmailConfirmation === null) {
      Alert.alert(
        'Sign in required',
        'Your email is confirmed. Sign in to continue with onboarding.',
      );

      startTransition(() => {
        router.replace('/(auth)/login');
    ***REMOVED***);

      return;
  ***REMOVED***

    try {
      setErrorMessage('');

      const session = await loginMutation.mutateAsync({
        login: pendingEmailConfirmation.email,
        password: pendingEmailConfirmation.password,
    ***REMOVED***);

      await auth.completeSignIn(session);
      auth.clearPendingEmailConfirmation();

      startTransition(() => {
        router.replace('/(onboarding)/profile');
    ***REMOVED***);
  ***REMOVED*** catch (error: unknown) {
      setErrorMessage(getApiErrorMessage(error, 'Confirm your email first, then try again.'));
  ***REMOVED***
***REMOVED***;

  const handleResendEmailPress = (): void => {
    Alert.alert('Confirmation email sent', 'We sent another confirmation email.');
***REMOVED***;

  const handleChangeEmailPress = (): void => {
    void resetRegistrationFlow();
***REMOVED***;

  return (
    <OnboardingScaffold
      description="Click the link in your email to activate your account before continuing."
      onBackPress={handleBackPress}
      onPrimaryActionPress={() => {
        void handlePrimaryActionPress();
    ***REMOVED***}
      primaryActionDisabled={loginMutation.isPending}
      primaryActionErrorText={errorMessage}
      primaryActionLabel={loginMutation.isPending ? 'Checking...' : "I've confirmed my email"}
      title="Please confirm your email"
    >
      <View className="rounded-[24px] border border-light-gray bg-foreground-background p-5">
        <Typography variant="title-small">Check your inbox</Typography>
        <Typography variant="body-small" className="mt-2 text-neutral-400">
          We sent a confirmation link to the email address you used during sign up.
        </Typography>
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-3">
        <View className="flex-1">
          <Button
            label="Resend"
            onPress={handleResendEmailPress}
            size="md"
            variant="outline"
          />
        </View>
        <View className="flex-1">
          <Button
            label="Change email"
            onPress={handleChangeEmailPress}
            size="md"
            variant="ghost"
          />
        </View>
      </View>
    </OnboardingScaffold>
  );
}
