import React from "react";
import {
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { Typography } from "./Typography";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-[12px]",
  {
    variants: {
      variant: {
        primary: "bg-primary",
        secondary: "bg-heading-text",
        outline: "bg-white border border-primary",
        ghost: "bg-transparent",
    ***REMOVED***,
      size: {
        sm: "py-2 px-4",
        md: "py-4 px-6",
        lg: "py-6 px-8",
        "icon-only": "p-3",
    ***REMOVED***,
      fullWidth: {
        true: "w-full",
    ***REMOVED***,
  ***REMOVED***,
    defaultVariants: {
      variant: "primary",
      size: "md",
  ***REMOVED***,
***REMOVED***,
);

const buttonTextVariants = cva("font-semibold", {
  variants: {
    variant: {
      primary: "text-heading-text font-bold",
      secondary: "text-white font-bold",
      outline: "text-heading-text font-medium",
      ghost: "text-heading-text font-bold",
  ***REMOVED***,
    size: {
      sm: "text-[14px]",
      md: "text-[18px]",
      lg: "text-[20px]",
      "icon-only": "text-[16px]",
  ***REMOVED***,
***REMOVED***,
  defaultVariants: {
    variant: "primary",
    size: "md",
***REMOVED***,
});

export interface ButtonProps
  extends
    Omit<TouchableOpacityProps, "children">,
    VariantProps<typeof buttonVariants> {
  label?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  subText?: string;
  errorText?: string;
  className?: string;
}

export function Button({
  label,
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  subText,
  errorText,
  className,
  ...props
}: ButtonProps) {
  const isIconOnly = size === "icon-only";
  const isDisabled = props.disabled === true;

  return (
    <View>
      <TouchableOpacity
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          isDisabled && "opacity-60",
          className,
        )}
        activeOpacity={0.7}
        {...props}
      >
        {leadingIcon && <View className="mr-2">{leadingIcon}</View>}

        {!isIconOnly && label && (
          <Typography
            variant="body-medium"
            className={cn(buttonTextVariants({ variant, size }), "leading-[1]")}
          >
            {label}
          </Typography>
        )}

        {isIconOnly && leadingIcon
          ? null
          : trailingIcon && <View className="ml-2">{trailingIcon}</View>}
      </TouchableOpacity>

      {subText && !errorText && (
        <Typography
          variant="body-small"
          className="mt-1.5 ml-1 text-neutral-400"
        >
          {subText}
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
