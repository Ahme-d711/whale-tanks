"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: any;
}

export type FilterFieldType = "tabs";

export interface FilterField {
  id: string;
  label?: string;
  type: FilterFieldType;
  options: FilterOption[];
  className?: string;
}

interface TableFilterBarProps {
  fields: FilterField[];
  values: Record<string, any>;
  onFilterChange: (id: string, value: any) => void;
  rightContent?: React.ReactNode;
}

export function TableFilterBar({ 
  fields, 
  values, 
  onFilterChange, 
  rightContent 
}: TableFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-8">
        {fields.map((field) => (
          <div key={field.id} className={cn("flex flex-col gap-2", field.className)}>
            {field.label && (
              <span className="text-xs font-semibold text-content-tertiary uppercase tracking-wider px-1">
                {field.label}
              </span>
            )}
            <div className="flex items-center p-1 bg-gray-100/50 rounded-[20px] border border-divider/30 backdrop-blur-sm shadow-inner">
              {field.options.map((option) => {
                const isActive = values[field.id] === option.value;
                return (
                  <button
                    key={String(option.value)}
                    onClick={() => onFilterChange(field.id, option.value)}
                    className={cn(
                      "relative px-6 py-2 text-sm font-medium transition-colors duration-300 rounded-[16px] z-10",
                      isActive 
                        ? "text-primary drop-shadow-sm" 
                        : "text-content-tertiary hover:text-content-secondary"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={`active-pill-${field.id}`}
                        className="absolute inset-0 bg-white rounded-[16px] shadow-sm ring-1 ring-black/5"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {rightContent && (
        <div className="flex items-center gap-2 self-end">
          {rightContent}
        </div>
      )}
    </div>
  );
}
