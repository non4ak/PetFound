import React, { ReactNode } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Switch, View } from "react-native";

import { Typography } from "./Typography";

export interface ControlledSwitchProps<T extends FieldValues> {
  children?: ReactNode;
  control: Control<T>;
  description?: string;
  name: Path<T>;
  title: string;
  variant?: "inline" | "stacked";
}

export function ControlledSwitch<T extends FieldValues>({
  children,
  control,
  description,
  name,
  title,
  variant = "inline",
}: ControlledSwitchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="rounded-xl border border-secondary-text bg-secondary-highlight p-4">
          {variant === "inline" ? (
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1">
                <Typography
                  variant="body-regular"
                  className="text-heading-text font-semibold"
                >
                  {title}
                </Typography>
                {description ? (
                  <Typography
                    variant="body-small"
                    className="mt-1 text-neutral-400"
                  >
                    {description}
                  </Typography>
                ) : null}
              </View>
              <Switch
                onValueChange={onChange}
                thumbColor="#FDFDFD"
                trackColor={{ false: "#C7C7CC", true: "#F2C94C" }}
                value={value}
              />
            </View>
          ) : (
            <View className="gap-2">
              <View className="flex-row items-center justify-between gap-4">
                <Typography
                  variant="body-small"
                  className="font-semibold text-heading-text flex-1"
                >
                  {title}
                </Typography>
                <Switch
                  onValueChange={onChange}
                  thumbColor="#FDFDFD"
                  trackColor={{ false: "#C7C7CC", true: "#F2C94C" }}
                  value={value}
                />
              </View>
              {description ? (
                <Typography variant="body-small" className="text-neutral-400">
                  {description}
                </Typography>
              ) : null}
            </View>
          )}

          {children ? <View className="mt-2">{children}</View> : null}
        </View>
      )}
    />
  );
}
