import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { type Control, type FieldValues, type Path } from "react-hook-form";

import { ControlledMediaUpload } from "@/components/media/ControlledMediaUpload";
import { Typography } from "@/components/ui/Typography";

export interface ControlledProfilePhotoUploadProps<T extends FieldValues> {
  control: Control<T>;
  label: string;
  name: Path<T>;
}

export function ControlledProfilePhotoUpload<T extends FieldValues>({
  control,
  label,
  name,
}: ControlledProfilePhotoUploadProps<T>) {
  return (
    <ControlledMediaUpload
      allowsEditing
      aspect={[1, 1]}
      control={control}
      mediaTypes={["images"]}
      name={name}
      cameraPermissionDeniedMessage="Allow camera access to take a profile photo."
      cameraPermissionDeniedTitle="Camera access is required"
      libraryPermissionDeniedMessage="Allow photo library access to upload a profile photo."
      libraryPermissionDeniedTitle="Photo access is required"
      pickerQuality={0.9}
      sourceMode="both"
      uploadFailedFallbackMessage="Please try again."
      uploadFailedTitle="Profile photo upload failed"
    >
      {({ isUploading, previewUri, select }) => (
        <TouchableOpacity
          activeOpacity={0.82}
          className="items-center"
          disabled={isUploading}
          onPress={select}
        >
          <View className="h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-[#FFF7EA]">
            {previewUri.length > 0 ? (
              <Image
                source={{ uri: previewUri }}
                style={{ height: 80, width: 80 }}
                contentFit="cover"
              />
            ) : (
              <Ionicons
                name={isUploading ? "cloud-upload-outline" : "person-outline"}
                size={28}
                color="#D89F35"
              />
            )}
          </View>
          <Typography variant="body-small" className="mt-2 text-secondary-text">
            {isUploading ? "Uploading..." : label}
          </Typography>
        </TouchableOpacity>
      )}
    </ControlledMediaUpload>
  );
}
