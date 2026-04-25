"use client"

import React from "react"
import { useTranslations } from 'next-intl'
import PricingCard from "../components/PricingCard"
import { usePackages } from "@/features/dashboard/packages/hooks/usePackages"
import { Package } from "@/features/dashboard/packages/types/package.types"
import { Skeleton } from "@/components/ui/skeleton"
import { useSubscriptions } from "@/features/dashboard/subscriptions/hooks/useSubscriptions"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { addDays } from "date-fns"

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function PricingTemplate() {
  const t = useTranslations('Landing.Pricing')
  const { packages, isLoading } = usePackages({ active_only: true })
  const { createSubscription, isCreating } = useSubscriptions()
  
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)

  const getFeatures = (index: number) => {
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

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setIsConfirmOpen(true)
  }

  const handleConfirmSubscription = async () => {
    if (!selectedPackage) return

    const startDate = new Date()
    const endDate = addDays(startDate, selectedPackage.duration_days)

    try {
      await createSubscription({
        package_id: selectedPackage.package_id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      })
      setIsConfirmOpen(false)
    } catch (error) {
      // Handled by hook
    }
  }

  return (
    <div className="w-full container mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:py-12 pt-20 space-y-8 md:space-y-12 md:px-12">
      <div className="space-y-6 md:space-y-8 xl:px-16">
        <h1 className="text-xl md:text-[32px] font-semibold text-foreground">{t('title')}</h1>
        
        <div className="text-center p-1">
          <h2 className="text-primary text-2xl md:text-[40px] font-black leading-tight tracking-normal font-poppins mb-4 md:mb-6">{t('choose_plan')}</h2>
          <p className="text-secondary-foreground text-xs md:text-sm font-medium leading-relaxed tracking-normal font-poppins px-4">{t('subtitle')}</p>
        </div>
      </div>

      <div className="pb-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
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
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <PricingCard 
                  key={pkg.package_id || index}
                  title={pkg.name}
                  duration={formatDuration(pkg.duration_days)}
                  price={`$${pkg.price}`}
                  features={getFeatures(index)}
                  monthlyPrice={pkg.duration_days > 30 ? `$${Math.round(pkg.price / (pkg.duration_days / 30))}` : undefined}
                  onSelect={() => handleSelectPackage(pkg)}
                />
              ))}
            </div>

            {/* Mobile Swiper */}
            <div className="md:hidden">
              <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1.1}
                pagination={{ clickable: true }}
                centeredSlides={true}
                className="pb-12 pricing-swiper"
              >
                {packages.map((pkg, index) => (
                  <SwiperSlide key={pkg.package_id || index}>
                    <PricingCard 
                      title={pkg.name}
                      duration={formatDuration(pkg.duration_days)}
                      price={`$${pkg.price}`}
                      features={getFeatures(index)}
                      monthlyPrice={pkg.duration_days > 30 ? `$${Math.round(pkg.price / (pkg.duration_days / 30))}` : undefined}
                      onSelect={() => handleSelectPackage(pkg)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={t('subscribe_confirm_title')}
        description={t('subscribe_confirm_desc', { planName: selectedPackage?.name || "" })}
        variant="default"
        onConfirm={handleConfirmSubscription}
        isLoading={isCreating}
        confirmLabel={t('select_plan')}
        cancelLabel={t('plans.cancel') || "Cancel"} 
      />
    </div>
  )
}
