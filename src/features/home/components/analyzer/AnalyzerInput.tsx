"use client"

import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { AttachmentList } from '@/components/shared/analyzer/AttachmentList'
import { AnalyzerCounter } from '@/components/shared/analyzer/AnalyzerCounter'

interface AnalyzerInputProps {
  value: string
  onChange: (value: string) => void
  attachments?: File[]
  onRemoveAttachment?: (index: number) => void
}

export const AnalyzerInput = ({ value, onChange, attachments = [], onRemoveAttachment }: AnalyzerInputProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()

  return (
    <div className="relative mb-4">
      <AnalyzerCounter 
        className={cn(
          "absolute top-0 select-none",
          locale === 'ar' ? "left-0" : "right-0"
        )}
      />

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full min-h-20 placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-xl! font-normal text-foreground leading-tight shadow-none",
          locale === 'ar' ? "pl-20" : "pr-20"
        )}
        placeholder={t('title')}
      />
      
      <AttachmentList 
        attachments={attachments} 
        onRemove={onRemoveAttachment || (() => {})} 
      />
    </div>
  )
}
