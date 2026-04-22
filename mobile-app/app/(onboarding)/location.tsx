import React, { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingScaffold } from "@/components/onboarding/OnboardingScaffold";
import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/ControlledInput";
import { Stepper } from "@/components/ui/Stepper";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  onboardingLocationSchema,
  type OnboardingLocationFormValues,
} from "@/utils/validations/onboardingSchema";
import { Typography } from "@/components/ui/Typography";

export default function LocationOnboardingScreen() {
  const { onboardingDraft, saveLocationStep } = useOnboarding();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
***REMOVED*** = useForm<OnboardingLocationFormValues>({
    defaultValues: onboardingDraft.location,
    resolver: zodResolver(onboardingLocationSchema),
***REMOVED***);

  const handleUseCurrentLocationPress = (): void => {
    Alert.alert(
      "Location access",
      "Wire this button to device location when you add permissions.",
    );
***REMOVED***;

  const handleContinuePress = async (
    values: OnboardingLocationFormValues,
  ): Promise<void> => {
    saveLocationStep(values);

    startTransition(() => {
      router.push("./pet");
  ***REMOVED***);
***REMOVED***;

  const handleBackPress = (): void => {
    saveLocationStep(getValues());
    router.back();
***REMOVED***;

  return (
    <OnboardingScaffold
      onBackPress={handleBackPress}
      onPrimaryActionPress={handleSubmit(handleContinuePress)}
      primaryActionErrorText={errors.root?.message}
      primaryActionLabel="Continue"
      bottomContent={<OnboardingProgress activeStep={2} totalSteps={4} />}
      primaryActionButtonVariant="outline"
    >
      <Stepper
        currentPage={2}
        totalPages={4}
        title="Your location"
        subtitle="We show you lost pets nearby. Your city is enough â€” we never share your exact address."
      />
      <View className="gap-5">
        <Button
          fullWidth
          label="Use my current location"
          leadingIcon={
            <Ionicons name="location-outline" size={20} color="#0F172A" />
        ***REMOVED***
          onPress={handleUseCurrentLocationPress}
          size="lg"
          variant="primary"
        />

        <Typography
          variant="body-small"
          className="text-center text-neutral-600 py-4"
        >
          or enter manually
        </Typography>

        <ControlledInput
          control={control}
          label="Country"
          placeholder="Ukraine"
          name="country"
        />

        <ControlledInput
          control={control}
          label="City"
          placeholder="Kyiv"
          name="city"
        />
      </View>
    </OnboardingScaffold>
  );
}
