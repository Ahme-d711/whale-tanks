"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      {/* Stats Grid Skeleton - Section 1 */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[140px] rounded-[24px] p-6 bg-white border border-divider space-y-4">
               <div className="flex justify-between items-start">
                 <Skeleton className="h-4 w-24 rounded-lg" />
                 <Skeleton className="h-8 w-8 rounded-full" />
               </div>
               <Skeleton className="h-8 w-20 rounded-lg" />
               <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid Skeleton - Section 2 */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[140px] rounded-[24px] p-6 bg-white border border-divider space-y-4">
               <div className="flex justify-between items-start">
                 <Skeleton className="h-4 w-24 rounded-lg" />
                 <Skeleton className="h-8 w-8 rounded-full" />
               </div>
               <Skeleton className="h-8 w-20 rounded-lg" />
               <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[24px] border border-divider h-[420px] flex flex-col space-y-6">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <div className="flex-1 flex items-center justify-center">
               <Skeleton className="h-[250px] w-[250px] rounded-full border-20 border-gray-50" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
           <div className="bg-white p-6 rounded-[24px] border border-divider h-[420px] flex flex-col space-y-6">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <div className="flex-1 w-full space-y-4 pt-4">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-4 w-24 rounded-md" />
                      <Skeleton className="h-8 flex-1 rounded-full" />
                      <Skeleton className="h-4 w-12 rounded-md" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Big Chart Skeleton */}
      <div className="space-y-8">
        <div className="flex justify-center">
           <Skeleton className="h-12 w-80 rounded-full" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
      </div>
    </div>
  )
}
