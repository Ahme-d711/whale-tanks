"use client";

import React from "react";
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

export interface UniSelectProps {
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

export function UniSelect({
  value,
  onValueChange,
  defaultValue,
  placeholder,
  options,
  isLoading,
  disabled,
  className,
  triggerClassName,
}: UniSelectProps) {
  return (
    <div className={cn("w-full", className)}>
      <Select
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className={cn("rounded-xl w-full h-14!", triggerClassName)}>
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
    </div>
  );
}
