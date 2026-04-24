import React, { startTransition } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import { OnboardingScaffold } from "@/components/onboarding/OnboardingScaffold";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useSubmitOnboardingMutation } from "@/data/hooks/onboarding";
import { getApiErrorMessage } from "@/utils/apiError";

export default function AllSetOnboardingScreen() {
  const auth = useAuth();
  const { clearOnboardingDraft, onboardingDraft } = useOnboarding();
  const router = useRouter();
  const submitOnboardingMutation = useSubmitOnboardingMutation();

  const handleGoToHomePress = async (): Promise<void> => {
    try {
      await submitOnboardingMutation.mutateAsync(onboardingDraft);
      clearOnboardingDraft();
      await auth.finishOnboarding();

      startTransition(() => {
        router.replace("/(tabs)");
    ***REMOVED***);
  ***REMOVED*** catch {
      return;
  ***REMOVED***
***REMOVED***;

  return (
    <OnboardingScaffold
      description="Your account is ready. Start using the app right away."
      onBackPress={() => router.back()}
      onPrimaryActionPress={() => {
        void handleGoToHomePress();
    ***REMOVED***}
      primaryActionDisabled={submitOnboardingMutation.isPending}
      primaryActionButtonVariant="outline"
      primaryActionErrorText={
        submitOnboardingMutation.error
          ? getApiErrorMessage(
              submitOnboardingMutation.error,
              "Unable to finish onboarding right now.",
            )
          : undefined
    ***REMOVED***
      primaryActionLabel={
        submitOnboardingMutation.isPending ? "Finishing..." : "Go to Home"
    ***REMOVED***
      title="You're all set!"
    >
      <View className="items-center px-6 py-10">
        <Typography variant="title-large" className="mt-6 text-center">
          You’re all set!
        </Typography>
        <Typography
          variant="body-small"
          className="mt-2 text-center text-neutral-400"
        >
          Welcome to the PetFound community. Let&apos;s help reunite some
          families. 🐶🐱
        </Typography>
      </View>
    </OnboardingScaffold>
  );
}
