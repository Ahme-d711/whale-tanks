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
import { UniInput, UniInputProps } from "./UniInput";

interface FormInputProps<T extends FieldValues> extends Omit<UniInputProps, "name"> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isLoading,
  ...props
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={props.className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <UniInput
              {...field}
              {...props}
              placeholder={placeholder}
              isLoading={isLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
