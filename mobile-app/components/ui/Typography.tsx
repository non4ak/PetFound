import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const typographyVariants = cva("text-black", {
  variants: {
    variant: {
      "hero-title":
        "text-[36px] font-bold tracking-tight leading-[1.2] text-heading-text",
      "title-large": "text-[32px] font-bold leading-[1.2] text-heading-text",
      "title-medium":
        "text-[24px] font-semibold leading-[1.2] text-heading-text",
      "title-small": "text-[20px] font-medium leading-[1.3] text-heading-text",
      "body-regular":
        "text-[18px] font-normal leading-[1.5] text-paragraph-text",
      "body-small": "text-[16px] font-normal leading-[1.5] text-paragraph-text",
      "body-medium":
        "text-[18px] font-medium leading-[1.5] text-paragraph-text",
  ***REMOVED***,
***REMOVED***,
  defaultVariants: {
    variant: "body-regular",
***REMOVED***,
});

export interface TypographyProps
  extends RNTextProps, VariantProps<typeof typographyVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Typography({
  className,
  variant,
  children,
  ...props
}: TypographyProps) {
  return (
    <RNText
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    >
      {children}
    </RNText>
  );
}
