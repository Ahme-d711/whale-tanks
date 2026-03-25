"use client";

import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UniSelect, UniSelectOption } from "./UniSelect";

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: UniSelectOption[];
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  isLoading,
  disabled,
  className,
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <UniSelect
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder={placeholder}
              options={options}
              isLoading={isLoading}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
