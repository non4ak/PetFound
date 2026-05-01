import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Control, FieldValues, Path } from "react-hook-form";

import { ControlledMediaUpload } from "@/components/media/ControlledMediaUpload";
import { cn } from "@/utils";

import { Typography } from "@/components/ui/Typography";

export interface ControlledPhotoUploadProps<T extends FieldValues> {
  control: Control<T>;
  errorText?: string;
  helperText?: string;
  isOptional?: boolean;
  label: string;
  name: Path<T>;
}

export function ControlledPhotoUpload<T extends FieldValues>({
  control,
  errorText,
  helperText,
  label,
  name,
}: ControlledPhotoUploadProps<T>) {
  return (
    <ControlledMediaUpload
      allowsEditing
      aspect={[1, 1]}
      control={control}
      errorText={errorText}
      mediaTypes={["images"]}
      name={name}
      cameraPermissionDeniedMessage="Allow camera access to take a pet photo."
      cameraPermissionDeniedTitle="Camera access is required"
      libraryPermissionDeniedMessage="Allow photo library access to upload a pet photo."
      libraryPermissionDeniedTitle="Photo access is required"
      pickerQuality={0.9}
      sourceMode="both"
      uploadFailedFallbackMessage="Please try again."
      uploadFailedTitle="Photo upload failed"
    >
      {({ errorText: displayedErrorText, isUploading, previewUri, remove, select, value }) => {
        return (
          <View className="items-start">
            <View className="items-center">
              <TouchableOpacity
                activeOpacity={0.82}
                className={cn(
                  "h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[22px] border border-dashed bg-white",
                  displayedErrorText ? "border-red-500" : "border-[#F6A623]",
                )}
                disabled={isUploading}
                onPress={select}
              >
                {previewUri.length > 0 ? (
                  <Image
                    source={{ uri: previewUri }}
                    style={{ height: 72, width: 72 }}
                    contentFit="cover"
                  />
                ) : isUploading ? (
                  <ActivityIndicator color="#1E1E1E" />
                ) : (
                  <Ionicons name="add" size={30} color="#1E1E1E" />
                )}
              </TouchableOpacity>

              {value.length > 0 || previewUri.length > 0 ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-heading-text"
                  disabled={isUploading}
                  onPress={remove}
                >
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              ) : null}

              <Typography
                variant="body-small"
                className="mt-2 text-center text-secondary-text"
              >
                {isUploading ? "Uploading..." : label}
              </Typography>
            </View>

            {helperText && !displayedErrorText ? (
              <Typography variant="body-small" className="mt-1.5 ml-1 text-neutral-400">
                {helperText}
              </Typography>
            ) : null}

            {displayedErrorText ? (
              <Typography variant="body-small" className="mt-1.5 ml-1 text-red-500">
                {displayedErrorText}
              </Typography>
            ) : null}
          </View>
        );
    ***REMOVED***}
    </ControlledMediaUpload>
  );
}
