import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AnnouncementDetailsFormCards } from "@/components/announcement/AnnouncementDetailsFormCards";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";
import {
  foundPetDetailsSchema,
  type FoundPetDetailsFormValues,
} from "@/utils/validations/foundPetSchema";

export default function FoundPetDetailsScreen() {
  const router = useRouter();
  const { details, updateDetails } = useFoundPetFlow();

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
***REMOVED*** = useForm<FoundPetDetailsFormValues>({
    defaultValues: details,
    resolver: zodResolver(foundPetDetailsSchema),
***REMOVED***);

  useEffect(() => {
    reset(details);
***REMOVED***, [details, reset]);

  const saveCurrentFormValues = (): void => {
    const values: FoundPetDetailsFormValues = getValues();

    updateDetails({
      city: values.city.trim(),
      country: values.country.trim(),
      dateLastSeen: values.dateLastSeen.trim(),
      description: values.description.trim(),
      lastSeenLatitude: details.lastSeenLatitude,
      lastSeenLongitude: details.lastSeenLongitude,
      showPhone: values.showPhone,
      showTelegram: values.showTelegram,
      timeApproximate: values.timeApproximate.trim(),
  ***REMOVED***);
***REMOVED***;

  const handleChooseLocationPress = (): void => {
    saveCurrentFormValues();
    router.push("/found-pet/location-picker");
***REMOVED***;

  const handlePreviewPress = (values: FoundPetDetailsFormValues): void => {
    updateDetails({
      city: values.city.trim(),
      country: values.country.trim(),
      dateLastSeen: values.dateLastSeen.trim(),
      description: values.description.trim(),
      lastSeenLatitude: details.lastSeenLatitude,
      lastSeenLongitude: details.lastSeenLongitude,
      showPhone: values.showPhone,
      showTelegram: values.showTelegram,
      timeApproximate: values.timeApproximate.trim(),
  ***REMOVED***);
    router.push("/found-pet/preview");
***REMOVED***;

  return (
    <AppScreenScaffold
      footer={
        <View>
          <Button
            fullWidth
            label="Preview post"
            onPress={handleSubmit(handlePreviewPress)}
            size="md"
            trailingIcon={
              <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
          ***REMOVED***
            variant="primary"
          />
          <OnboardingProgress activeStep={3} totalSteps={4} />
        </View>
    ***REMOVED***
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#94A3B8" />
          </TouchableOpacity>
          <View className="w-10" />
        </View>
    ***REMOVED***
    >
      <Stepper
        currentPage={3}
        totalPages={4}
        title="Where & when?"
        subtitle="Tell us where you last saw your pet."
      />

      <AnnouncementDetailsFormCards
        control={control}
        errors={errors}
        isDescriptionOptional
        onChooseLocationPress={handleChooseLocationPress}
      />
    </AppScreenScaffold>
  );
}
