"use client"

import { useTranslations } from 'next-intl'
import { ServiceCard } from "@/components/shared/ServiceCard"
import AboutInfo from "../components/AboutInfo"

export default function AboutTemplate() {
  const t = useTranslations('Landing.About')

  const examples = [
    {
      icon: "/logo.svg",
      title: t('projects.restaurant'),
      subtitle: "Blue Whale",
      features: [
        t('projects.restaurant_desc1'),
        t('projects.restaurant_desc2')
      ]
    },
    {
      icon: "/logo.svg",
      title: t('projects.clothes'),
      subtitle: "Black Whale",
      features: [
        t('projects.clothes_desc1'),
        t('projects.clothes_desc2')
      ]
    },
    {
      icon: "/logo.svg",
      title: t('projects.restaurant'),
      subtitle: "Blue Whale",
      features: [
        t('projects.restaurant_desc1'),
        t('projects.restaurant_desc2')
      ]
    }
  ]

  return (
    <div className="w-full container mx-auto min-h-screen max-w-[1440px] px-4 md:px-12 xl:px-29 py-12 pt-40 space-y-6">
      <AboutInfo />

      {/* Examples Header */}
      <div>
        <h2 className="text-[32px] font-semibold text-foreground">{t('examples')}</h2>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-start">
        {examples.map((example, index) => (
          <ServiceCard
            key={index}
            icon={example.icon}
            title={example.title}
            subtitle={example.subtitle}
            features={example.features}
          />
        ))}
      </div>
    </div>
  )
}
