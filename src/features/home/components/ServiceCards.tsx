"use client"

import { ServiceCard } from '@/components/shared/ServiceCard'

import { useTranslations } from 'next-intl'

export const ServiceCards = () => {
  const t = useTranslations('HomePage.Services')

  const services = [
    {
      icon: '/startup-logo.svg',
      title: t('startup.title'),
      subtitle: t('startup.subtitle'),
      description: t('startup.description'),
      features: [
        t('startup.feature1'),
        t('startup.feature2')
      ],
    },
    {
      icon: '/tech-logo.svg',
      title: t('tech.title'),
      subtitle: t('tech.subtitle'),
      description: t('tech.description'),
      features: [
        t('tech.feature1'),
        t('tech.feature2'),
        t('tech.feature3'),
        t('tech.feature4'),
        t('tech.feature5'),
        t('tech.feature6')
      ],
    },
    {
      icon: '/logo.svg',
      title: t('investor.title'),
      subtitle: t('investor.subtitle'),
      description: t('investor.description'),
      features: [
        t('investor.feature1'),
        t('investor.feature2')
      ],
    }
  ]

  return (
    <section className="relative z-10 px-4 pb-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  )
}
