"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TimePeriodTabs, type TimePeriod } from './TimePeriodTabs';
import { RevenueOverall } from './RevenueOverall';
import { getRevenueAnalytics } from "../services/dashboard.services";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartsSection() {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("Week");

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue-analytics", activePeriod],
    queryFn: () => getRevenueAnalytics(activePeriod),
  });

  return (
    <>
      <div className="flex justify-center">
        <TimePeriodTabs value={activePeriod} onChange={setActivePeriod} />
      </div>
      
      {isLoading ? (
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
      ) : (
        <RevenueOverall stats={revenueData} />
      )}
    </>
  );
}
