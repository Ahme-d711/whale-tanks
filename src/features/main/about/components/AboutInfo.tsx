"use client"

import React from 'react'
import { useTranslations } from 'next-intl'

export default function AboutInfo() {
  const t = useTranslations('Landing.About')

  return (
    <section className="space-y-6">
      <h1 className="text-xl md:text-[32px] font-semibold text-foreground mb-4 md:mb-6">{t('title')}</h1>
      <div className="space-y-4 md:space-y-6 text-sm md:text-lg lg:text-xl text-secondary-foreground leading-relaxed">
        <p>
          {t.rich('description', {
            br: (chunks) => <><br />{chunks}</>
          })}
        </p>
      </div>
    </section>
  )
}
