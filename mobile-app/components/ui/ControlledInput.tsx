import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, InputProps } from "./Input";

export interface ControlledInputProps<T extends FieldValues> extends Omit<
  InputProps,
  "value" | "onChangeText" | "onBlur"
> {
  control: Control<T>;
  name: Path<T>;
  isOptional?: boolean;
}

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  errorText,
  isOptional,
  ...inputProps
}: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
    ***REMOVED***) => (
        <Input
          isOptional={isOptional}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          errorText={error?.message || errorText}
          {...inputProps}
        />
      )}
    />
  );
}
