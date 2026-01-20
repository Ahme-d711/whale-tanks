"use client"

import { motion } from "motion/react"
import { Mic, ArrowUpRight, ArrowUpLeft, Plus } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'
import { AttachmentList } from '@/components/shared/analyzer/AttachmentList'
import { AnalyzerCounter } from '@/components/shared/analyzer/AnalyzerCounter'

export default function DashboardIdeaAnalyzer() {
  const locale = useLocale()
  const t = useTranslations('HomePage.Analyzer')
  
  const {
    ideaText,
    setIdeaText,
    attachments,
    isRecording,
    fileInputRef,
    handleToggleRecording,
    handleFilesSelected,
    handleRemoveAttachment,
    handleSend,
    triggerFileInput
  } = useIdeaAnalyzer((data) => {
    console.log("Dashboard Sending Idea Data:", data)
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-5 border-2 border-primary flex flex-col shadow-sm"
    >
      <div className="flex-1 relative">
        <Textarea
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          className="w-full h-full min-h-[126px] placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-lg font-medium text-foreground leading-snug shadow-none"
          placeholder={t('title')}
        />
      </div>

      <AttachmentList 
        attachments={attachments} 
        onRemove={handleRemoveAttachment} 
        size="sm"
      />

      <div className="flex items-center justify-end gap-2 text-foreground">
        <input 
          type="file" 
          multiple 
          hidden 
          ref={fileInputRef} 
          onChange={handleFilesSelected} 
        />
        
        {/* Controls Pill */}
        <div className="flex items-center gap-2.5 bg-border rounded-full px-4 py-1.5 ">
          <AnalyzerCounter showCounter={true} />
          
          <button 
            onClick={handleToggleRecording}
            className={`transition-all ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
          >
            <Mic strokeWidth={3} className={`w-4 h-4 ${isRecording ? 'fill-current' : ''}`} />
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={triggerFileInput}
            className="h-5 w-5 rounded-xl hover:bg-background cursor-pointer"
          >
            <Plus className="w-4! h-4! text-foreground bg-foreground/30 rounded-sm" />
          </Button>
        </div>

        {/* Send Pill */}
        <button 
          onClick={handleSend}
          className="flex items-center gap-2 bg-border hover:bg-border/80 transition-colors rounded-full px-4 py-1.5 text-foreground font-medium text-sm"
        >
          <span>{t('send')}</span>
          <div className="w-5 h-5 flex items-center justify-center rounded-md text-foreground bg-foreground/30">
            {locale === 'ar' ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          </div>
        </button>
      </div>
    </motion.div>
  )
}
