import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "./Typography";
import { cn } from "@/utils";

export interface SelectChipOption<TValue> {
  label: string;
  value: TValue;
}

export interface ControlledSelectChipsProps<
  TFieldValues extends FieldValues,
  TValue,
> {
  control: Control<TFieldValues>;
  label: string;
  name: Path<TFieldValues>;
  options: readonly SelectChipOption<TValue>[];
  isOptional?: boolean;
}

function getChipClassName(isActive: boolean): string {
  return cn(
    "rounded-full border px-6 py-2 border-secondary-text ",
    isActive ? "bg-primary" : "bg-secondary-highlight",
  );
}

function OptionChip({
  isSelected,
  label,
  onPress,
}: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={getChipClassName(isSelected)}
      onPress={onPress}
    >
      <Typography
        variant="body-small"
        className="font-semibold text-heading-text"
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
}

export function ControlledSelectChips<
  TFieldValues extends FieldValues,
  TValue,
>({
  control,
  label,
  name,
  options,
  isOptional,
}: ControlledSelectChipsProps<TFieldValues, TValue>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <Typography
            variant="body-medium"
            className="mb-2 font-medium text-heading-text"
          >
            {label}
            {isOptional && (
              <Typography variant="body-small" className="text-secondary-text">
                optional
              </Typography>
            )}
          </Typography>
          <View className="flex-row flex-wrap gap-3">
            {options.map((option) => (
              <OptionChip
                key={option.label}
                isSelected={value === option.value}
                label={option.label}
                onPress={() => onChange(option.value)}
              />
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
