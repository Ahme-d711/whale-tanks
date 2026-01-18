"use client"

import React from 'react'
import { Info } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AnalyzerInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export const AnalyzerInput = ({ value, onChange, maxLength = 500 }: AnalyzerInputProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()

  return (
    <div className="relative mb-4">
      <div className={cn(
        "absolute top-0 flex items-center gap-1 text-xs font-medium text-foreground select-none",
        locale === 'ar' ? "left-0" : "right-0"
      )}>
        <span>{value.length}/{maxLength}</span>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="w-5 h-5 flex items-center justify-center rounded-full text-foreground cursor-help">
                <Info className="w-4 h-4 bg-foreground/30 rounded-full" />
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-secondary text-foreground border-none rounded-lg px-3 py-1.5 font-bold z-110"
            >
              <p>{t('info_tooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        className={cn(
          "w-full min-h-38 placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-xl! font-normal text-foreground leading-tight shadow-none",
          locale === 'ar' ? "pl-20" : "pr-20"
        )}
        maxLength={maxLength}
        placeholder={t('title')}
      />
    </div>
  )
}
