import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "./Typography";
import { cn } from "@/utils";

export interface NotificationChannelOption<TValue> {
  label: string;
  value: TValue;
}

interface ControlledNotificationChannelProps<
  TFieldValues extends FieldValues,
  TValue,
> {
  control: Control<TFieldValues>;
  label?: string;
  name: Path<TFieldValues>;
  options: readonly NotificationChannelOption<TValue>[];
}

function getChannelChipClassName(isSelected: boolean): string {
  return cn(
    "rounded-full border px-8 py-2 border-secondary-text",
    isSelected ? "bg-primary" : "bg-secondary-highlight",
  );
}

export function ControlledNotificationChannel<
  TFieldValues extends FieldValues,
  TValue,
>({
  control,
  label = "Notification channel",
  name,
  options,
}: ControlledNotificationChannelProps<TFieldValues, TValue>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="p-4">
          <Typography
            variant="body-regular"
            className="font-semibold text-heading-text"
          >
            {label}
          </Typography>
          <View className="mt-3 flex-row gap-3">
            {options.map((option: NotificationChannelOption<TValue>) => (
              <TouchableOpacity
                key={option.label}
                className={getChannelChipClassName(value === option.value)}
                onPress={() => onChange(option.value)}
              >
                <Typography
                  variant="body-small"
                  className="font-semibold text-heading-text"
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
          {error?.message ? (
            <Typography
              variant="body-small"
              className="mt-1.5 ml-1 text-red-500"
            >
              {error.message}
            </Typography>
          ) : null}
        </View>
      )}
    />
  );
}
