import React, { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

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

interface ResolvedLocation {
  city: string;
  country: string;
}

function resolveCityName(address: Location.LocationGeocodedAddress): string {
  return (
    address.city ??
    address.district ??
    address.subregion ??
    address.region ??
    ""
  ).trim();
}

function resolveCountryName(address: Location.LocationGeocodedAddress): string {
  return (address.country ?? address.isoCountryCode ?? "").trim();
}

function mapAddressToLocation(
  address: Location.LocationGeocodedAddress,
): ResolvedLocation | null {
  const city: string = resolveCityName(address);
  const country: string = resolveCountryName(address);

  if (city.length === 0 || country.length === 0) {
    return null;
  }

  return {
    city,
    country,
  };
}

async function resolveCurrentLocation(): Promise<ResolvedLocation | null> {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    return null;
  }

  const location: Location.LocationObject =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

  const addresses: Location.LocationGeocodedAddress[] =
    await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

  if (addresses.length === 0) {
    return null;
  }

  return mapAddressToLocation(addresses[0]);
}

export default function LocationOnboardingScreen() {
  const { onboardingDraft, saveLocationStep } = useOnboarding();
  const router = useRouter();
  const [isResolvingLocation, setIsResolvingLocation] =
    useState<boolean>(false);
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
  } = useForm<OnboardingLocationFormValues>({
    defaultValues: onboardingDraft.location,
    resolver: zodResolver(onboardingLocationSchema),
  });

  const handleUseCurrentLocationPress = async (): Promise<void> => {
    try {
      setIsResolvingLocation(true);
      const location: ResolvedLocation | null = await resolveCurrentLocation();

      if (location === null) {
        Alert.alert(
          "Location unavailable",
          "Allow location access and make sure location services are enabled, or enter your city manually.",
        );
        return;
      }

      setValue("country", location.country, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setValue("city", location.city, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Unknown location error.";

      Alert.alert(
        "Location error",
        `Could not determine your city. ${message}`,
      );
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const handleContinuePress = async (
    values: OnboardingLocationFormValues,
  ): Promise<void> => {
    saveLocationStep(values);

    startTransition(() => {
      router.push("./pet");
    });
  };

  const handleBackPress = (): void => {
    saveLocationStep(getValues());
    router.back();
  };

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
          disabled={isResolvingLocation}
          fullWidth
          label={
            isResolvingLocation
              ? "Detecting location..."
              : "Use my current location"
          }
          leadingIcon={
            isResolvingLocation ? (
              <ActivityIndicator color="#0F172A" size="small" />
            ) : (
              <Ionicons name="location-outline" size={20} color="#0F172A" />
            )
          }
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
