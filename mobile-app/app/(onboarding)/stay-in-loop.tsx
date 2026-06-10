import React, { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { useRouter } from "expo-router";

import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingScaffold } from "@/components/onboarding/OnboardingScaffold";
import {
  ControlledNotificationChannel,
  type NotificationChannelOption,
} from "@/components/ui/ControlledNotificationChannel";
import { ControlledSwitch } from "@/components/ui/ControlledSwitch";
import { Stepper } from "@/components/ui/Stepper";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { NotificationChannelPreference } from "@/types/onboarding";
import {
  onboardingStayInLoopSchema,
  type OnboardingStayInLoopFormValues,
} from "@/utils/validations/onboardingSchema";

const NOTIFICATION_CHANNELS: readonly NotificationChannelOption<NotificationChannelPreference>[] =
  [
    { label: "Push", value: NotificationChannelPreference.Push },
    { label: "Email", value: NotificationChannelPreference.Email },
    { label: "Both", value: NotificationChannelPreference.Both },
  ];

function createStayInLoopDefaultValues(): OnboardingStayInLoopFormValues {
  return {
    matchFoundEnabled: true,
    nearbyPostsEnabled: true,
    newCommentEnabled: true,
    notificationChannelPreference: NotificationChannelPreference.Push,
  };
}

export default function StayInLoopOnboardingScreen() {
  const { clearStayInLoopStep, onboardingDraft, saveStayInLoopStep } =
    useOnboarding();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<OnboardingStayInLoopFormValues>({
    defaultValues:
      onboardingDraft.stayInLoop ?? createStayInLoopDefaultValues(),
    resolver: zodResolver(onboardingStayInLoopSchema),
  });

  const handleContinuePress = async (
    values: OnboardingStayInLoopFormValues,
  ): Promise<void> => {
    saveStayInLoopStep(values);

    startTransition(() => {
      router.push("./all-set");
    });
  };

  const handleBackPress = (): void => {
    saveStayInLoopStep(getValues());
    router.back();
  };

  const handleSkipPress = (): void => {
    clearStayInLoopStep();

    startTransition(() => {
      router.replace("./all-set");
    });
  };

  return (
    <OnboardingScaffold
      onBackPress={handleBackPress}
      onPrimaryActionPress={handleSubmit(handleContinuePress)}
      primaryActionErrorText={errors.root?.message}
      onTopActionPress={handleSkipPress}
      primaryActionLabel="All done"
      topActionLabel="Skip for now"
      bottomContent={<OnboardingProgress activeStep={4} totalSteps={4} />}
      primaryActionButtonVariant="outline"
    >
      <Stepper
        currentPage={4}
        totalPages={4}
        title="Stay in the loop"
        subtitle="Choose what you want to hear about and how you want to hear it."
        isOptional
      />
      <View className="gap-4">
        <ControlledSwitch
          control={control}
          description="Get alerted when one of your posts may have a match."
          name="matchFoundEnabled"
          title="Match found"
        />

        <ControlledSwitch
          control={control}
          description="Be notified when someone comments on your post."
          name="newCommentEnabled"
          title="New comment"
        />

        <ControlledSwitch
          control={control}
          description="Receive community updates from nearby lost pet reports."
          name="nearbyPostsEnabled"
          title="Nearby posts"
        />

        <ControlledNotificationChannel
          control={control}
          name="notificationChannelPreference"
          options={NOTIFICATION_CHANNELS}
        />
      </View>
    </OnboardingScaffold>
  );
}
