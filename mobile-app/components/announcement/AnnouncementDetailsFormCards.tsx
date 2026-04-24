import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/ControlledInput";
import { Typography } from "@/components/ui/Typography";

import { ContactPreferenceRow } from "./ContactPreferenceRow";

interface AnnouncementDetailsFormFields {
  city: string;
  country: string;
  dateLastSeen: string;
  description: string;
  showPhone: boolean;
  showTelegram: boolean;
  timeApproximate: string;
}

interface AnnouncementDetailsFormCardsProps<
  T extends FieldValues & AnnouncementDetailsFormFields,
> {
  control: Control<T>;
  errors: {
    city?: { message?: string };
    country?: { message?: string };
    dateLastSeen?: { message?: string };
    description?: { message?: string };
    timeApproximate?: { message?: string };
  };
  isDescriptionOptional?: boolean;
}

export function AnnouncementDetailsFormCards<
  T extends FieldValues & AnnouncementDetailsFormFields,
>({ control, errors, isDescriptionOptional }: AnnouncementDetailsFormCardsProps<T>) {
  return (
    <>
      {/* Location */}
      <View className="rounded-[20px] border border-[#ECE5D4] bg-white p-4">
        <Button
          fullWidth
          label="Choose location on a map"
          onPress={() => {}}
          size="md"
          variant="primary"
        />
        <View className="mt-4 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-[#E5E7EB]" />
          <Typography variant="body-small" className="text-secondary-text">
            or enter manually
          </Typography>
          <View className="h-px flex-1 bg-[#E5E7EB]" />
        </View>

        <View className="mt-4 gap-4">
          <ControlledInput
            control={control}
            errorText={errors.country?.message}
            label="Country"
            name={"country" as Path<T>}
            placeholder="Ukraine"
          />
          <ControlledInput
            control={control}
            errorText={errors.city?.message}
            label="City"
            name={"city" as Path<T>}
            placeholder="Kharkiv"
          />
        </View>
      </View>

      {/* Date & Time */}
      <View className="mt-4 rounded-[20px] border border-[#ECE5D4] bg-white p-4">
        <View className="gap-4">
          <ControlledInput
            control={control}
            errorText={errors.dateLastSeen?.message}
            label="Date last seen"
            name={"dateLastSeen" as Path<T>}
            placeholder="12/10/2024"
          />
          <ControlledInput
            control={control}
            errorText={errors.timeApproximate?.message}
            isOptional
            label="Approx. time"
            name={"timeApproximate" as Path<T>}
            placeholder="14:00"
          />
        </View>
      </View>

      {/* Description */}
      <View className="mt-4 rounded-[20px] border border-[#ECE5D4] bg-white p-4">
        <ControlledInput
          className="min-h-[120px] pt-4"
          containerClassName="pb-2"
          control={control}
          errorText={errors.description?.message}
          isOptional={isDescriptionOptional}
          label="Description"
          multiline
          name={"description" as Path<T>}
          numberOfLines={5}
          placeholder="Distinctive markings, collar colour, last known behaviour..."
          textAlignVertical="top"
        />
      </View>

      {/* Contact Preferences */}
      <View className="mt-4 gap-3">
        <Controller
          control={control}
          name={"showPhone" as Path<T>}
          render={({ field: { onChange, value } }) => (
            <ContactPreferenceRow
              onChange={onChange}
              title="Show my phone"
              value={value as boolean}
            />
          )}
        />
        <Controller
          control={control}
          name={"showTelegram" as Path<T>}
          render={({ field: { onChange, value } }) => (
            <ContactPreferenceRow
              onChange={onChange}
              title="Show Telegram"
              value={value as boolean}
            />
          )}
        />
      </View>
    </>
  );
}
