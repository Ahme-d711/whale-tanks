"use client"

import React from 'react'
import { motion } from "framer-motion"
import { Info, Mic, ArrowUpRight, CirclePlus } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'

export default function DashboardIdeaAnalyzer() {
  const t = useTranslations('HomePage.Analyzer')
  const [ideaText, setIdeaText] = React.useState('')
  const maxChars = 500

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full bg-white rounded-[32px] p-8 border-2 border-[#2260FF] flex flex-col shadow-sm"
    >
      <div className="flex-1 relative">
        <Textarea
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value.slice(0, maxChars))}
          className="w-full h-full min-h-[140px] placeholder:text-[#64748B] p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-2xl font-medium text-[#1A2B4B] leading-snug shadow-none"
          maxLength={maxChars}
          placeholder={t('title')}
        />
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        {/* Controls Pill */}
        <div className="flex items-center gap-3 bg-[#EEF2F6] rounded-full px-5 py-2.5">
          <span className="text-sm font-semibold text-[#1A2B4B]">{ideaText.length}/{maxChars}</span>
          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2260FF] text-white">
            <Info className="w-3 h-3" />
          </div>
          <div className="w-px h-4 bg-[#CBD5E1] mx-1" />
          <button className="text-[#1A2B4B] hover:opacity-70 transition-opacity">
            <Mic className="w-5 h-5" />
          </button>
          <button className="text-[#1A2B4B] hover:opacity-70 transition-opacity">
            <CirclePlus className="w-5 h-5" />
          </button>
        </div>

        {/* Send Pill */}
        <button className="flex items-center gap-2 bg-[#EEF2F6] hover:bg-[#E2E8F0] transition-colors rounded-full px-6 py-2.5 text-[#1A2B4B] font-semibold">
          <span>{t('send')}</span>
          <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#CBD5E1]/50">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </motion.div>
  )
}
