import React, { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingScaffold } from "@/components/onboarding/OnboardingScaffold";
import { ControlledProfilePhotoUpload } from "@/components/profile/ControlledProfilePhotoUpload";
import { ControlledInput } from "@/components/ui/ControlledInput";
import { ControlledSwitch } from "@/components/ui/ControlledSwitch";
import { Stepper } from "@/components/ui/Stepper";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  onboardingProfileSchema,
  type OnboardingProfileFormValues,
} from "@/utils/validations/onboardingSchema";

export default function ProfileOnboardingScreen() {
  const { onboardingDraft, saveProfileStep } = useOnboarding();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
***REMOVED*** = useForm<OnboardingProfileFormValues>({
    defaultValues: onboardingDraft.profile,
    resolver: zodResolver(onboardingProfileSchema),
***REMOVED***);

  const handleContinuePress = async (
    values: OnboardingProfileFormValues,
  ): Promise<void> => {
    saveProfileStep({
      isPhonePublic: values.isPhonePublic,
      phoneNumber: values.phoneNumber,
      socialNetwork: values.socialNetwork,
      userPhotoUrl: values.userPhotoUrl,
      userName: values.userName,
  ***REMOVED***);

    startTransition(() => {
      router.push("./location");
  ***REMOVED***);
***REMOVED***;

  const handleBackPress = (): void => {
    const values: OnboardingProfileFormValues = getValues();

    saveProfileStep(values);

    router.back();
***REMOVED***;

  return (
    <OnboardingScaffold
      onBackPress={handleBackPress}
      onPrimaryActionPress={handleSubmit(handleContinuePress)}
      primaryActionErrorText={errors.root?.message}
      primaryActionLabel="Continue"
      bottomContent={<OnboardingProgress activeStep={1} totalSteps={4} />}
      primaryActionButtonVariant="outline"
    >
      <Stepper
        currentPage={1}
        totalPages={4}
        title="Your profile"
        subtitle="How should the community know you?"
      />
      <View className="gap-5">
        <View className="items-center">
          <ControlledProfilePhotoUpload
            control={control}
            label="Add profile photo"
            name="userPhotoUrl"
          />
        </View>

        <ControlledInput
          autoCapitalize="none"
          autoCorrect={false}
          control={control}
          label="Username"
          placeholder="@petlover"
          name="userName"
        />

        <ControlledInput
          control={control}
          keyboardType="phone-pad"
          label="Phone number"
          placeholder="+38 (0__) ___-__-__"
          name="phoneNumber"
        />

        <ControlledSwitch
          control={control}
          description="Others can contact you directly on posts. You can change anytime in settings."
          name="isPhonePublic"
          title="Make phone public"
          variant="stacked"
        />

        <ControlledInput
          autoCapitalize="none"
          autoCorrect={false}
          control={control}
          isOptional
          label="Social media"
          placeholder="@your_account_name"
          name="socialNetwork"
        />
      </View>
    </OnboardingScaffold>
  );
}
