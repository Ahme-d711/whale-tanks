"use client"

import React from 'react'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AnalyzerCounterProps {
  className?: string
  showCounter?: boolean
}

export const AnalyzerCounter = ({ className = "", showCounter = true }: AnalyzerCounterProps) => {
  const t = useTranslations('HomePage.Analyzer')

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {showCounter && <span className="text-xs font-medium text-foreground">0/500</span>}
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="w-4 h-4 flex items-center justify-center border-none rounded-full bg-foreground/30 text-foreground cursor-help">
              <Info className="w-3.5 h-3.5" />
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="bg-secondary text-foreground border-none rounded-lg px-2 py-1 font-bold z-110"
          >
            <p className="text-xs">{t('info_tooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
