import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  TouchableOpacity,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { Typography } from "./Typography";
import { Ionicons } from "@expo/vector-icons";

const inputVariants = cva(
  "w-full rounded-[12px] text-[16px] font-normal text-heading-text px-4",
  {
    variants: {
      variant: {
        default: "bg-white border border-light-gray",
        error: "bg-white border border-red-500",
      },
      size: {
        sm: "py-3",
        md: "py-4",
        lg: "py-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<RNTextInputProps, "className">,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  isPassword?: boolean;
  isOptional?: boolean;
}

export function Input({
  label,
  helperText,
  errorText,
  leadingIcon,
  isOptional,
  variant,
  size,
  className,
  containerClassName,
  isPassword = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const currentVariant = errorText ? "error" : variant;

  return (
    <View className={cn("w-full", containerClassName)}>
      {label && (
        <View className="mb-2 flex-row items-center gap-2">
          <Typography
            variant="body-regular"
            className="text-heading-text font-medium"
          >
            {label}
          </Typography>
          {isOptional && (
            <Typography variant="body-small" className="text-secondary-text">
              optional
            </Typography>
          )}
        </View>
      )}

      <View className="relative">
        {leadingIcon && (
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            {leadingIcon}
          </View>
        )}

        <RNTextInput
          className={cn(
            inputVariants({ variant: currentVariant, size }),
            leadingIcon && "pl-12",
            isPassword && "pr-12",
            className,
          )}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 top-0 bottom-0 justify-center"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>

      {helperText && !errorText && (
        <Typography
          variant="body-small"
          className="mt-1.5 ml-1 text-neutral-400"
        >
          {helperText}
        </Typography>
      )}

      {errorText && (
        <Typography variant="body-small" className="mt-1.5 ml-1 text-red-500">
          {errorText}
        </Typography>
      )}
    </View>
  );
}
