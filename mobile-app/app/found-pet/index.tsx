import React, { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useForm } from "react-hook-form";

import { ControlledMediaUpload } from "@/components/media/ControlledMediaUpload";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Typography } from "@/components/ui/Typography";
import { useFoundPetFlow } from "@/contexts/FoundPetFlowContext";

interface FoundPetPhotoFormValues {
  photoUri: string;
}

export default function FoundPetPhotoScreen() {
  const router = useRouter();
  const { photoUri, setPhotoUri } = useFoundPetFlow();
  const { control, reset } = useForm<FoundPetPhotoFormValues>({
    defaultValues: { photoUri: photoUri ?? "" },
***REMOVED***);

  useEffect(() => {
    reset({ photoUri: photoUri ?? "" });
***REMOVED***, [photoUri, reset]);

  return (
    <ControlledMediaUpload
      allowsEditing
      aspect={[4, 4]}
      control={control}
      mediaTypes={["images"]}
      name="photoUri"
      cameraPermissionDeniedMessage="Allow camera access to take a found pet photo."
      cameraPermissionDeniedTitle="Camera access is required"
      libraryPermissionDeniedMessage="Allow photo library access to upload a found pet photo."
      libraryPermissionDeniedTitle="Photo access is required"
      pickerQuality={0.9}
      sourceMode="both"
      onUploaded={setPhotoUri}
      uploadFailedFallbackMessage="Please try again."
      uploadFailedTitle="Photo upload failed"
    >
      {({ isUploading, previewUri, select, value }) => (
        <AppScreenScaffold
          footer={
            <View>
              <Button
                fullWidth
                label="Continue"
                disabled={isUploading}
                onPress={() => router.push("/found-pet/info")}
                size="md"
                trailingIcon={
                  <Ionicons name="arrow-forward" size={18} color="#1E1E1E" />
              ***REMOVED***
                variant="outline"
              />
              <OnboardingProgress activeStep={1} totalSteps={4} />
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
          scrollContentClassName="pb-2"
        >
          <Stepper
            currentPage={1}
            totalPages={4}
            title="Add a pet"
            subtitle="A photo is the most important thing. Owners recognise their pet instantly."
          />

          <TouchableOpacity
            activeOpacity={0.85}
            className="min-h-[220px] items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-primary bg-[#FFF7EA] px-6 py-16"
            disabled={isUploading}
            onPress={select}
          >
            {previewUri.length > 0 ? (
              <Image
                source={{ uri: previewUri }}
                style={{ height: 220, width: "100%" }}
                contentFit="cover"
              />
            ) : isUploading ? (
              <ActivityIndicator color="#D89F35" />
            ) : value.length > 0 ? (
              <>
                <Ionicons name="checkmark-circle" size={48} color="#D89F35" />
                <Typography
                  variant="body-medium"
                  className="mt-4 font-semibold text-heading-text"
                >
                  Photo uploaded
                </Typography>
              </>
            ) : (
              <>
                <Ionicons name="camera-outline" size={40} color="#D89F35" />
                <Typography
                  variant="body-medium"
                  className="mt-4 font-semibold text-heading-text"
                >
                  Take or upload photo
                </Typography>
              </>
            )}
          </TouchableOpacity>

          <Typography variant="body-small" className="mt-5 text-secondary-text">
            Even a blurry photo helps. Our AI uses image recognition to find
            matches between posts.
          </Typography>
        </AppScreenScaffold>
      )}
    </ControlledMediaUpload>
  );
}
