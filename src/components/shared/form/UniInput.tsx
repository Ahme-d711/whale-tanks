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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface UniInputProps<T extends FieldValues = any>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  control?: Control<T>;
  name?: Path<T> | string;
  label?: string;
  isLoading?: boolean;
}

export const UniInput = <T extends FieldValues>({
  control,
  name,
  label,
  isLoading,
  disabled,
  className,
  ...props
}: UniInputProps<T>) => {
  const inputEl = (field?: any) => (
    <Input
      {...field}
      {...props}
      disabled={disabled || isLoading}
      className="h-16! px-4 rounded-xl"
    />
  );

  if (control && name) {
    return (
      <FormField
        control={control}
        name={name as Path<T>}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>{inputEl(field)}</FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <FormLabel>{label}</FormLabel>}
      {inputEl()}
    </div>
  );
};
