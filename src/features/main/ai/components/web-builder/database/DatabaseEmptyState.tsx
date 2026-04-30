"use client"

import React from 'react'
import { Database as DBIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const DatabaseEmptyState = () => {
  const t = useTranslations('WebBuilder')
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-50/50">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
         <DBIcon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-zinc-800 mb-2">{t('no_schema_title')}</h3>
      <p className="text-zinc-500 max-w-[320px] leading-relaxed">
        {t('no_schema_desc')}
      </p>
    </div>
  )
}
