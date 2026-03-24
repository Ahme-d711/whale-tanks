"use client";

import { useState } from "react";
import { mockRevenueAnalytics } from "../utils/mockHomeData";
import { TimePeriod, TimePeriodTabs } from "./TimePeriodTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RevenueOverall } from "./RevenueOverall";

export function ChartsSection() {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("Week");

  // Commented out real API call to make it static as requested
  /*
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue-analytics", activePeriod],
    queryFn: () => getRevenueAnalytics(activePeriod),
  });
  */

  const revenueData = mockRevenueAnalytics[activePeriod];
  const isLoading = false;

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
