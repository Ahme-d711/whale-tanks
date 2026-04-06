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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface UniSelectOption {
  label: string;
  value: string;
}

export interface UniSelectProps<T extends FieldValues = any> {
  control?: Control<T>;
  name?: Path<T>;
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  options: UniSelectOption[];
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function UniSelect<T extends FieldValues>({
  control,
  name,
  label,
  value,
  onValueChange,
  defaultValue,
  placeholder,
  options,
  isLoading,
  disabled,
  className,
  triggerClassName,
}: UniSelectProps<T>) {
  const content = (field?: any) => (
    <Select
      value={field?.value ?? value}
      onValueChange={field?.onChange ?? onValueChange}
      defaultValue={field?.value ?? defaultValue ?? ""}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={cn("rounded-xl w-full h-12!", triggerClassName)}>
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl" position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>{content(field)}</FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <FormLabel>{label}</FormLabel>}
      {content()}
    </div>
  );
}
