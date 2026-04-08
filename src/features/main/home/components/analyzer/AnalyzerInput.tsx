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
  compact?: boolean
}

export const AnalyzerInput = ({ value, onChange, attachments = [], onRemoveAttachment, compact }: AnalyzerInputProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()

  return (
    <div className={cn("relative w-full flex items-center", !compact && "mb-4 flex-col items-start")}>
      {!compact && (
        <AnalyzerCounter 
          className={cn(
            "absolute top-0 select-none",
            locale === 'ar' ? "left-0" : "right-0"
          )}
        />
      )}

      <Textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          // Simple auto-resize logic
          e.target.style.height = 'auto'
          e.target.style.height = `${e.target.scrollHeight}px`
        }}
        className={cn(
          "w-full placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-sm md:text-base font-normal text-foreground leading-[1.4] shadow-none no-scrollbar transition-[height] duration-200",
          compact ? "h-6 min-h-[24px]" : "min-h-10 md:min-h-12",
          !compact && (locale === 'ar' ? "pl-20" : "pr-20")
        )}
        placeholder={t('title')}
      />
      
      {!compact && (
        <AttachmentList 
          attachments={attachments} 
          onRemove={onRemoveAttachment || (() => {})} 
        />
      )}
    </div>
  )
}
