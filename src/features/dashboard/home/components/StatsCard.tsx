"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  variant: "secondary" | "primary";
}

export function StatsCard({
  title,
  value,
  trend,
  isUp,
  variant,
}: StatsCardProps) {
  const isDark = variant === "primary";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[24px] p-6 h-[140px] relative overflow-hidden transition-all hover:scale-[1.02]",
        isDark ? "bg-primary text-white" : "bg-secondary text-primary"
      )}
    >
      <span className={cn("text-base font-medium opacity-80")}>
        {title}
      </span>
      <div className="flex items-center justify-between gap-2">
        <span className="text-3xl font-bold tracking-tight">
          {value}
        </span>

        <div className="flex items-center gap-1 text-xs font-medium">
          <span>{trend}</span>
          {isUp ? (
            <TrendingUp className="size-3.5" />
          ) : (
            <TrendingDown className="size-3.5" />
          )}
        </div>
      </div>
    </div>
  );
}
