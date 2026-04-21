"use client"

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
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export const AnalyzerInput = ({ value, onChange, attachments = [], onRemoveAttachment, compact, onKeyDown }: AnalyzerInputProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()

  return (
    <div className={cn("relative w-full flex items-center", !compact ? "flex-col items-start" : "")}>
      <AnalyzerCounter 
        className={cn(
          "absolute top-0 select-none transition-opacity duration-200",
          compact ? "opacity-0 pointer-events-none" : "opacity-100",
          locale === 'ar' ? "left-0" : "right-0"
        )}
      />

      <Textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          e.target.style.height = 'auto'
          e.target.style.height = `${e.target.scrollHeight}px`
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "w-full placeholder:text-muted-foreground/60 p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-sm md:text-xl font-normal text-foreground leading-[1.6] shadow-none no-scrollbar transition-[height] duration-200",
          compact ? "h-6 min-h-[24px]" : "min-h-[40px] md:min-h-[60px]",
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
