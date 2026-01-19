"use client"

import React from 'react'
import Image from 'next/image'
import { Mic, ArrowUpRight, ArrowUpLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'


import { toast } from 'sonner'
import { useRef } from 'react'

interface AnalyzerToolbarProps {
  isRecording: boolean
  onToggleRecording: () => void
  onFilesSelected: (files: File[]) => void
}

export const AnalyzerToolbar = ({ isRecording, onToggleRecording, onFilesSelected }: AnalyzerToolbarProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onFilesSelected(files)
      toast.success(t('files_attached', { count: files.length }))
      // Reset input so same file can be selected again
      e.target.value = ''
    }
  }

  const handleMicClick = () => {
    onToggleRecording()
    if (!isRecording) {
      toast.info(t('recording_started'))
    } else {
      toast.success(t('recording_saved'))
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Tank Selection Buttons */}
      <Button
        variant="ghost"
        className="h-10 px-3 gap-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl cursor-pointer"
      >
        <Image src="/startup-logo.svg" alt="Startup" width={18} height={18} className="object-contain" />
        <span className="text-sm font-medium">{t('startup')}</span>
      </Button>
      <Button
        variant="ghost"
        className="h-10 px-3 gap-2 bg-border hover:bg-border/80 text-foreground rounded-2xl cursor-pointer"
      >
        <Image src="/tech-logo.svg" alt="Tech" width={18} height={18} className="object-contain" />
        <span className="text-sm font-medium">{t('tech')}</span>
      </Button>
      <Button
        variant="ghost"
        className="h-10 px-3 gap-2 bg-border hover:bg-border/80 text-foreground rounded-2xl cursor-pointer"
      >
        <Image src="/logo.svg" alt="Investor" width={18} height={18} className="object-contain" />
        <span className="text-sm font-medium">{t('investor')}</span>
      </Button>

      <div className="flex-1" />

      {/* Action Buttons - Grouped */}
      <div className="flex items-center gap-2 bg-border text-foreground rounded-2xl p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMicClick}
          className={`h-8 w-8 rounded-xl hover:bg-background cursor-pointer transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : ''}`}
        >
          <Mic className={`w-5! h-5! ${isRecording ? 'fill-current' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8 rounded-xl hover:bg-background cursor-pointer"
        >
          <Plus className="w-5! h-5! text-foreground bg-foreground/30 rounded-sm" />
        </Button>
      </div>

      <Button
        variant="ghost"
        className="h-10 px-4 rounded-xl text-foreground gap-2 cursor-pointer bg-border hover:bg-border/80"
      >
        <span className="text-sm font-medium">{t('send')}</span>
        <div className="w-5 h-5 flex items-center justify-center rounded-sm text-foreground bg-foreground/30">
          {locale === 'ar' ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
      </Button>
    </div>
  )
}
