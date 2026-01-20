"use client"

import React from 'react'
import { motion } from "motion/react"
import { Info, Mic, ArrowUpRight, CirclePlus, ArrowUpLeft } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DashboardIdeaAnalyzer() {
  const locale = useLocale()
  const t = useTranslations('HomePage.Analyzer')
  const [ideaText, setIdeaText] = React.useState('')
  const maxChars = 500

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-5 border-2 border-primary flex flex-col shadow-sm"
    >
      <div className="flex-1 relative">
        <Textarea
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value.slice(0, maxChars))}
          className="w-full h-full min-h-[114px] placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-lg font-medium text-foreground leading-snug shadow-none"
          maxLength={maxChars}
          placeholder={t('title')}
        />
      </div>

      <div className="flex items-center justify-end gap-2 mt-3">
        {/* Controls Pill */}
        <div className="flex items-center gap-2.5 bg-border rounded-full px-4 py-1.5">
          <span className="text-xs font-medium text-foreground">0/500</span>

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="w-4 h-4 flex items-center justify-center border-none rounded-full bg-foreground/30 text-foreground cursor-help">
                  <Info className="w-4 h-4" />
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
          <button className="text-foreground hover:opacity-70 transition-opacity">
            <Mic className="w-4 h-4" />
          </button>
          <button className="text-foreground hover:opacity-70 transition-opacity">
            <CirclePlus className="w-4 h-4" />
          </button>
        </div>

        {/* Send Pill */}
        <button className="flex items-center gap-2 bg-border hover:bg-border/80 transition-colors rounded-full px-4 py-1.5 text-foreground font-medium text-sm">
          <span>{t('send')}</span>
          <div className="w-5 h-5 flex items-center justify-center rounded-md text-foreground bg-foreground/30">
                {locale === 'ar' ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          </div>
        </button>
      </div>
    </motion.div>
  )
}
