"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type TimePeriod = "Today" | "Yesterday" | "Week" | "Month";

const periods: TimePeriod[] = ["Today", "Yesterday", "Week", "Month"];

interface TimePeriodTabsProps {
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
}

export function TimePeriodTabs({ value, onChange }: TimePeriodTabsProps) {
  const t = useTranslations("Dashboard");
  return (
    <div className="bg-white rounded-[16px] inline-flex gap-1 shadow-sm border border-divider">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            "px-6 py-3.5 rounded-[12px] text-sm font-semibold transition-all duration-200 cursor-pointer",
            value === period
              ? "bg-secondary text-primary shadow-sm"
              : "text-content-secondary hover:bg-secondary/30 hover:text-primary"
          )}
        >
          {t(period.toLowerCase())}
        </button>
      ))}
    </div>
  );
}
