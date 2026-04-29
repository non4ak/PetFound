import React, { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { uploadPhotoFromUriQuery } from "@/data/queries/photos";
import { getApiErrorMessage } from "@/utils/apiError";

const DEFAULT_FILE_NAME = "media-upload.jpg";
const DEFAULT_CONTENT_TYPE = "image/jpeg";
const DEFAULT_FILE_SIZE_IN_BYTES = 1;

export type MediaUploadSourceMode = "camera" | "library" | "both";

export interface ControlledMediaUploadState {
  errorText?: string;
  isUploading: boolean;
  remove: () => void;
  select: () => Promise<void>;
  value: string;
}

export interface ControlledMediaUploadProps<T extends FieldValues> {
  allowsEditing: boolean;
  aspect: readonly [number, number];
  children: (state: ControlledMediaUploadState) => React.ReactElement;
  control: Control<T>;
  errorText?: string;
  mediaTypes: ImagePicker.MediaType[];
  name: Path<T>;
  cameraPermissionDeniedMessage: string;
  cameraPermissionDeniedTitle: string;
  libraryPermissionDeniedMessage: string;
  libraryPermissionDeniedTitle: string;
  pickerQuality: number;
  sourceMode: MediaUploadSourceMode;
  uploadFailedFallbackMessage: string;
  uploadFailedTitle: string;
}

function getAssetFileName(asset: ImagePicker.ImagePickerAsset): string {
  if (typeof asset.fileName === "string" && asset.fileName.trim().length > 0) {
    return asset.fileName.trim();
  }

  return DEFAULT_FILE_NAME;
}

function getAssetContentType(asset: ImagePicker.ImagePickerAsset): string {
  if (typeof asset.mimeType === "string" && asset.mimeType.trim().length > 0) {
    return asset.mimeType.trim();
  }

  return DEFAULT_CONTENT_TYPE;
}

function getAssetFileSizeInBytes(asset: ImagePicker.ImagePickerAsset): number {
  if (typeof asset.fileSize === "number" && asset.fileSize > 0) {
    return asset.fileSize;
  }

  return DEFAULT_FILE_SIZE_IN_BYTES;
}

async function requestMediaLibraryAccess(
  permissionDeniedTitle: string,
  permissionDeniedMessage: string,
): Promise<boolean> {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted) {
    return true;
  }

  Alert.alert(permissionDeniedTitle, permissionDeniedMessage);
  return false;
}

async function requestCameraAccess(
  permissionDeniedTitle: string,
  permissionDeniedMessage: string,
): Promise<boolean> {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (permissionResult.granted) {
    return true;
  }

  Alert.alert(permissionDeniedTitle, permissionDeniedMessage);
  return false;
}

async function pickMediaFromLibrary(
  allowsEditing: boolean,
  aspect: readonly [number, number],
  mediaTypes: ImagePicker.MediaType[],
  pickerQuality: number,
): Promise<ImagePicker.ImagePickerAsset | null> {
  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    allowsEditing,
    aspect: [aspect[0], aspect[1]],
    mediaTypes,
    quality: pickerQuality,
  });

  if (pickerResult.canceled || pickerResult.assets.length === 0) {
    return null;
  }

  return pickerResult.assets[0];
}

async function takeMediaWithCamera(
  allowsEditing: boolean,
  aspect: readonly [number, number],
  mediaTypes: ImagePicker.MediaType[],
  pickerQuality: number,
): Promise<ImagePicker.ImagePickerAsset | null> {
  const pickerResult = await ImagePicker.launchCameraAsync({
    allowsEditing,
    aspect: [aspect[0], aspect[1]],
    mediaTypes,
    quality: pickerQuality,
  });

  if (pickerResult.canceled || pickerResult.assets.length === 0) {
    return null;
  }

  return pickerResult.assets[0];
}

function chooseMediaSource(sourceMode: MediaUploadSourceMode): Promise<"camera" | "library" | null> {
  if (sourceMode === "camera") {
    return Promise.resolve("camera");
  }

  if (sourceMode === "library") {
    return Promise.resolve("library");
  }

  return new Promise((resolve) => {
    Alert.alert(
      "Add photo",
      "Choose how you want to add a pet photo.",
      [
        {
          text: "Take photo",
          onPress: () => resolve("camera"),
        },
        {
          text: "Choose from gallery",
          onPress: () => resolve("library"),
        },
        {
          style: "cancel",
          text: "Cancel",
          onPress: () => resolve(null),
        },
      ],
    );
  });
}

export function ControlledMediaUpload<T extends FieldValues>({
  allowsEditing,
  aspect,
  children,
  control,
  errorText,
  mediaTypes,
  name,
  cameraPermissionDeniedMessage,
  cameraPermissionDeniedTitle,
  libraryPermissionDeniedMessage,
  libraryPermissionDeniedTitle,
  pickerQuality,
  sourceMode,
  uploadFailedFallbackMessage,
  uploadFailedTitle,
}: ControlledMediaUploadProps<T>) {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const uploadedUrl: string = typeof value === "string" ? value : "";
        const displayedErrorText: string | undefined = error?.message ?? errorText;

        const handleSelectPress = async (): Promise<void> => {
          const mediaSource = await chooseMediaSource(sourceMode);

          if (mediaSource === null) {
            return;
          }

          const hasAccess: boolean =
            mediaSource === "camera"
              ? await requestCameraAccess(
                  cameraPermissionDeniedTitle,
                  cameraPermissionDeniedMessage,
                )
              : await requestMediaLibraryAccess(
                  libraryPermissionDeniedTitle,
                  libraryPermissionDeniedMessage,
                );

          if (!hasAccess) {
            return;
          }

          const selectedAsset =
            mediaSource === "camera"
              ? await takeMediaWithCamera(
                  allowsEditing,
                  aspect,
                  mediaTypes,
                  pickerQuality,
                )
              : await pickMediaFromLibrary(
                  allowsEditing,
                  aspect,
                  mediaTypes,
                  pickerQuality,
                );

          if (selectedAsset === null) {
            return;
          }

          setIsUploading(true);

          try {
            const uploadedMediaUrl: string = await uploadPhotoFromUriQuery({
              contentType: getAssetContentType(selectedAsset),
              fileName: getAssetFileName(selectedAsset),
              fileSizeInBytes: getAssetFileSizeInBytes(selectedAsset),
              uri: selectedAsset.uri,
            });

            onChange(uploadedMediaUrl);
          } catch (uploadError: unknown) {
            Alert.alert(
              uploadFailedTitle,
              getApiErrorMessage(uploadError, uploadFailedFallbackMessage),
            );
          } finally {
            setIsUploading(false);
          }
        };

        const handleRemovePress = (): void => {
          onChange("");
        };

        return children({
          errorText: displayedErrorText,
          isUploading,
          remove: handleRemovePress,
          select: handleSelectPress,
          value: uploadedUrl,
        });
      }}
    />
  );
}
