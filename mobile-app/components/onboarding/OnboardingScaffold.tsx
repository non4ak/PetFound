import React, { type ReactNode } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

interface OnboardingScaffoldProps {
  children: ReactNode;
  onBackPress: () => void;
  onPrimaryActionPress: () => void;
  primaryActionLabel: string;
  primaryActionErrorText?: string;
  primaryActionDisabled?: boolean;
  topActionLabel?: string;
  onTopActionPress?: () => void;
  bottomContent?: ReactNode;
  title?: string;
  description?: string;
  primaryActionButtonVariant?: "primary" | "secondary" | "outline";
}

export function OnboardingScaffold({
  children,
  onBackPress,
  onPrimaryActionPress,
  primaryActionLabel,
  primaryActionErrorText,
  primaryActionDisabled,
  topActionLabel,
  onTopActionPress,
  bottomContent,
  title,
  description,
  primaryActionButtonVariant = "primary",
}: OnboardingScaffoldProps) {
  return (
    <SafeAreaView className="flex-1 bg-alt-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-4 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onBackPress}
            className="h-10 w-10 items-center justify-center rounded-full bg-foreground-background"
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          {typeof topActionLabel === "string" &&
          typeof onTopActionPress === "function" ? (
            <TouchableOpacity
              onPress={onTopActionPress}
              className="rounded-2xl bg-foreground-background border border-secondary-text px-4 py-2"
            >
              <Typography
                variant="body-regular"
                className="font-semibold text-heading-text"
              >
                {topActionLabel}
              </Typography>
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}
        </View>

        {typeof title === "string" ? (
          <View className="mt-6 gap-2">
            <Typography variant="title-large">{title}</Typography>
            {typeof description === "string" ? (
              <Typography variant="body-small" className="text-neutral-400">
                {description}
              </Typography>
            ) : null}
          </View>
        ) : null}

        <View className="mt-8">{children}</View>

        <View className="mt-8">
          <Button
            disabled={primaryActionDisabled}
            errorText={primaryActionErrorText}
            fullWidth
            label={primaryActionLabel}
            onPress={onPrimaryActionPress}
            size="md"
            variant={primaryActionButtonVariant}
          />
        </View>

        {bottomContent}
      </ScrollView>
    </SafeAreaView>
  );
}
