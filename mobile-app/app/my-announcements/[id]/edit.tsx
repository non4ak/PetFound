import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { z } from "zod";

import { ControlledMediaUpload } from "@/components/media/ControlledMediaUpload";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/ControlledInput";
import { Typography } from "@/components/ui/Typography";
import {
  useGetAnnouncementById,
  useUpdateAnnouncement,
} from "@/data/hooks/announcements";
import { updatePetPhotoQuery } from "@/data/queries/pets";

const editSchema = z.object({
  petPhotoUrl: z.string(),
  country: z.string().trim().min(2, "Country is required"),
  city: z.string().trim().min(2, "City is required"),
  nearLandmark: z.string().trim().min(1, "Near landmark is required"),
  approximateTime: z.string().trim(),
  petDetails: z.string().trim().min(10, "Description must be at least 10 characters"),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function EditAnnouncementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const announcementId = Number(id);

  const { data: announcementData, isLoading } =
    useGetAnnouncementById(announcementId);
  const { mutateAsync: updateAnnouncement, isPending: isSaving } =
    useUpdateAnnouncement(announcementId);

  const announcement = announcementData?.data;
  const petInfo = announcementData?.data?.pet;

  const { control, handleSubmit, reset } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      petPhotoUrl: "",
      country: "",
      city: "",
      nearLandmark: "",
      approximateTime: "",
      petDetails: "",
  ***REMOVED***,
***REMOVED***);

  useEffect(() => {
    if (announcement && petInfo) {
      reset({
        petPhotoUrl: petInfo.petPhotoUrl ?? "",
        country: announcement.country ?? "",
        city: announcement.city ?? "",
        nearLandmark: announcement.nearLandmark ?? "",
        approximateTime: announcement.approximateTime ?? "",
        petDetails: announcement.petDetails ?? "",
    ***REMOVED***);
  ***REMOVED***
***REMOVED***, [announcement, petInfo, reset]);

  const onSubmit = async (values: EditFormValues) => {
    if (!announcement || !petInfo) return;

    try {
      const photoChanged = values.petPhotoUrl !== (petInfo.petPhotoUrl ?? "");
      if (photoChanged && values.petPhotoUrl.length > 0) {
        await updatePetPhotoQuery(petInfo.id, {
          petName: petInfo.petName,
          petType: petInfo.petType,
          petSex: petInfo.petSex,
          petSize: petInfo.petSize,
          petAgeCategory: petInfo.petAgeCategory,
          breed: petInfo.breed,
          chipNumber: petInfo.chipNumber,
          description: petInfo.description,
          petPhotoUrl: values.petPhotoUrl,
      ***REMOVED***);
    ***REMOVED***

      await updateAnnouncement({
        country: values.country,
        city: values.city,
        nearLandmark: values.nearLandmark,
        petDetails: values.petDetails,
        approximateTime: values.approximateTime,
        isPhonePublic: announcement.isPhonePublic,
        isTelegramActive: announcement.isTelegramActive,
        petStatus: announcement.petStatus,
        lastDateWhenSeen: announcement.lastDateWhenSeen,
    ***REMOVED***);

      router.back();
  ***REMOVED*** catch {
      Alert.alert("Error", "Failed to save changes. Please try again.");
  ***REMOVED***
***REMOVED***;

  return (
    <AppScreenScaffold
      footer={
        <Button
          fullWidth
          label={isSaving ? "Saving..." : "Save changes"}
          disabled={isSaving || isLoading}
          onPress={handleSubmit(onSubmit)}
          size="md"
          variant="primary"
        />
    ***REMOVED***
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white border border-[#CBD5E1]"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#94A3B8" />
          </TouchableOpacity>
          <Typography
            className="font-semibold text-heading-text"
            variant="body-regular"
          >
            Edit announcement
          </Typography>
          <View className="h-10 w-10" />
        </View>
    ***REMOVED***
      scrollContentClassName="pb-2"
    >
      {isLoading ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color="#F2C94C" />
        </View>
      ) : (
        <View className="gap-4">
          {/* Photo upload — large preview matching the creation flow */}
          <ControlledMediaUpload
            allowsEditing={false}
            aspect={[4, 3]}
            control={control}
            mediaTypes={["images"]}
            name="petPhotoUrl"
            cameraPermissionDeniedMessage="Allow camera access to take a pet photo."
            cameraPermissionDeniedTitle="Camera access is required"
            libraryPermissionDeniedMessage="Allow photo library access to upload a pet photo."
            libraryPermissionDeniedTitle="Photo access is required"
            pickerQuality={0.8}
            sourceMode="both"
            uploadFailedFallbackMessage="Please try again."
            uploadFailedTitle="Photo upload failed"
          >
            {({ isUploading, previewUri, select }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                className="min-h-[180px] items-center justify-center overflow-hidden rounded-[16px] border-2 border-dashed border-primary bg-[#FFF7EA]"
                disabled={isUploading}
                onPress={select}
              >
                {previewUri.length > 0 ? (
                  <View className="w-full">
                    <Image
                      source={{ uri: previewUri }}
                      style={{ height: 180, width: "100%" }}
                      contentFit="cover"
                    />
                    <View className="absolute bottom-2 right-2 flex-row items-center gap-1 rounded-full bg-black/50 px-3 py-1">
                      <Ionicons name="camera-outline" size={14} color="white" />
                      <Typography variant="body-small" className="text-white">
                        Change
                      </Typography>
                    </View>
                  </View>
                ) : isUploading ? (
                  <ActivityIndicator color="#D89F35" />
                ) : (
                  <View className="items-center gap-2">
                    <Ionicons name="camera-outline" size={36} color="#D89F35" />
                    <Typography
                      variant="body-medium"
                      className="font-semibold text-heading-text"
                    >
                      Add pet photo
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </ControlledMediaUpload>

          <View className="rounded-[20px] border border-[#ECE5D4] bg-white p-4 gap-4">
            <ControlledInput
              control={control}
              name="country"
              label="Country"
              placeholder="e.g. Poland"
            />
            <ControlledInput
              control={control}
              name="city"
              label="City"
              placeholder="e.g. Warsaw"
            />
            <ControlledInput
              control={control}
              name="nearLandmark"
              label="Near landmark"
              placeholder="e.g. Central Park"
            />
            <ControlledInput
              control={control}
              name="approximateTime"
              label="Approx. time"
              placeholder="e.g. 14:00"
              isOptional
            />
          </View>

          <View className="rounded-[20px] border border-[#ECE5D4] bg-white p-4">
            <ControlledInput
              className="min-h-[120px] pt-4"
              containerClassName="pb-2"
              control={control}
              name="petDetails"
              label="Description"
              placeholder="Distinctive markings, collar colour, last known behaviour..."
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>
      )}
    </AppScreenScaffold>
  );
}
