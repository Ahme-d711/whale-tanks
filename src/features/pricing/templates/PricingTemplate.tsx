"use client"

import { useTranslations } from 'next-intl'
import PricingCard from "../components/PricingCard"

export default function PricingTemplate() {
  const t = useTranslations('Landing.Pricing')

  const plans = [
    {
      title: t('plans.basic'),
      duration: t('plans.months_3'),
      price: "$10",
      saveText: `${t('plans.save')} 33%`,
      monthlyPrice: "$ 33",
      features: [
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
      ],
    },
    {
      title: t('plans.standard'),
      duration: t('plans.months_6'),
      price: "$50",
      saveText: `${t('plans.save')} 29%`,
      monthlyPrice: "$ 35",
      features: [
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy'), isLocked: true },
        { text: t('plans.feature_dummy'), isLocked: true },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
      ],
    },
    {
      title: t('plans.premium'),
      duration: t('plans.year_1'),
      price: "$100",
      features: [
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy'), isLocked: true },
        { text: t('plans.feature_dummy'), isLocked: true },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy') },
        { text: t('plans.feature_dummy'), isLocked: true },
        { text: t('plans.feature_dummy') },
      ],
    },

  ]

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
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </div>
  )
}
