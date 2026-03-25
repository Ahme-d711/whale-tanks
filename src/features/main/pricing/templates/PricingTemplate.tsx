"use client"

import { useTranslations } from 'next-intl'
import PricingCard from "../components/PricingCard"
import { usePackages } from "@/features/dashboard/packages/hooks/usePackages"
import { Skeleton } from "@/components/ui/skeleton"

export default function PricingTemplate() {
  const t = useTranslations('Landing.Pricing')
  const { packages, isLoading } = usePackages({ active_only: true })

  const getFeatures = (index: number) => {
    // Current placeholder features from PricingTemplate
    const baseFeatures = [
      { text: t('plans.feature_dummy') },
      { text: t('plans.feature_dummy') },
      { text: t('plans.feature_dummy') },
      { text: t('plans.feature_dummy') },
      { text: t('plans.feature_dummy') },
      { text: t('plans.feature_dummy') },
      { text: t('plans.feature_dummy') },
      { text: t('plans.feature_dummy') },
    ]
    
    // Add logic if needed to differentiate plans (locks)
    if (index === 0) return baseFeatures;
    if (index === 1) return baseFeatures.map((f, i) => (i === 2 || i === 3) ? { ...f, isLocked: true } : f);
    return baseFeatures.map((f, i) => (i === 2 || i === 3 || i === 6) ? { ...f, isLocked: true } : f);
  }

  const formatDuration = (days: number) => {
    if (days === 30) return t('plans.months_1')
    if (days === 90) return t('plans.months_3')
    if (days === 180) return t('plans.months_6')
    if (days === 365) return t('plans.year_1')
    return `${days} ${t('days')}`
  }

  return (
    <div className="w-full container mx-auto min-h-screen max-w-[1440px] px-4 py-12 pt-20 space-y-12 md:px-12">
      <div className="space-y-8 xl:px-16">
        <h1 className="text-[32px] font-semibold text-foreground">{t('title')}</h1>
        
        <div className="text-center p-1">
          <h2 className="text-primary text-[40px] font-black leading-[100%] tracking-normal font-poppins mb-6">{t('choose_plan')}</h2>
          <p className="text-secondary-foreground text-sm font-medium leading-[100%] tracking-normal font-poppins">{t('subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[600px] w-full bg-background rounded-2xl border border-border shadow-xl overflow-hidden p-8 flex flex-col gap-8">
               <Skeleton className="h-40 w-full rounded-xl" />
               <div className="flex-1 space-y-4">
                 {Array.from({ length: 8 }).map((_, j) => (
                   <div key={j} className="flex gap-4">
                     <Skeleton className="h-5 w-5 rounded-full" />
                     <Skeleton className="h-5 w-full flex-1" />
                   </div>
                 ))}
               </div>
               <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          ))
        ) : (
          packages.map((pkg, index) => (
            <PricingCard 
              key={pkg.package_id || index}
              title={pkg.name}
              duration={formatDuration(pkg.duration_days)}
              price={`$${pkg.price}`}
              features={getFeatures(index)}
              monthlyPrice={pkg.duration_days > 30 ? `$${Math.round(pkg.price / (pkg.duration_days / 30))}` : undefined}
            />
          ))
        )}
      </div>
    </div>
  )
}
