import React, { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { type Control, type FieldValues, type Path } from "react-hook-form";

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
  const [previewUri, setPreviewUri] = useState<string>("");
  void control;
  void name;

  const pickSourceAsync = (): Promise<"camera" | "library" | null> => {
    return new Promise((resolve) => {
      Alert.alert("Profile photo", "This is a UI preview only for now.", [
        { text: "Take photo", onPress: () => resolve("camera") },
        { text: "Choose from gallery", onPress: () => resolve("library") },
        { style: "cancel", text: "Cancel", onPress: () => resolve(null) },
      ]);
    });
  };

  const handlePress = async (): Promise<void> => {
    const source = await pickSourceAsync();

    if (source === null) {
      return;
    }

    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Camera access is required", "Allow camera access to preview a profile photo.");
        return;
      }
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Photo access is required", "Allow photo library access to preview a profile photo.");
        return;
      }
    }

    const pickerResult =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ["images"],
            quality: 0.9,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ["images"],
            quality: 0.9,
          });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setPreviewUri(pickerResult.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      className="items-center"
      onPress={handlePress}
    >
      <View className="h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-[#FFF7EA]">
        {previewUri.length > 0 ? (
          <Image
            source={{ uri: previewUri }}
            style={{ height: 80, width: 80 }}
            contentFit="cover"
          />
        ) : (
          <Ionicons name="person-outline" size={28} color="#D89F35" />
        )}
      </View>
      <Typography variant="body-small" className="mt-2 text-secondary-text">
        {label}
      </Typography>
    </TouchableOpacity>
  );
}
