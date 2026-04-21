"use client"

import React from 'react'
import Image from 'next/image'
import { Mic, ArrowUpRight, ArrowUpLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, MessageSquare, ClipboardList, Scissors, FileText, CheckCircle2, Sparkles } from 'lucide-react'
import { AIModel } from '@/features/dashboard/models/types/model.types'
import { cn } from '@/lib/utils'

interface AnalyzerToolbarProps {
  isRecording?: boolean
  onToggleRecording?: () => void
  onFilesSelectedDirect?: (files: File[]) => void
  onSend?: () => void
  triggerFileInput?: () => void
  fileInputRef?: React.RefObject<HTMLInputElement | null>
  isLoading?: boolean
  executionType: string
  setExecutionType: (value: any) => void
  analysisType: string
  setAnalysisType: (value: string) => void
  models: AIModel[]
  selectedModelId: string
  setSelectedModelId: (value: string) => void
  onlyActions?: boolean
  onlySelects?: boolean
  className?: string
}

export const AnalyzerToolbar = ({ 
  isRecording = false, 
  onToggleRecording, 
  onFilesSelectedDirect, 
  onSend,
  triggerFileInput,
  fileInputRef,
  isLoading,
  executionType,
  setExecutionType,
  analysisType,
  setAnalysisType,
  models,
  selectedModelId,
  setSelectedModelId,
  onlyActions,
  onlySelects,
  className
}: AnalyzerToolbarProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onFilesSelectedDirect) {
      const files = Array.from(e.target.files)
      onFilesSelectedDirect(files)
      toast.success(t('files_attached', { count: files.length }))
      e.target.value = ''
    }
  }

  const handleMicClick = () => {
    if (onToggleRecording) {
      onToggleRecording()
      if (!isRecording) {
        toast.info(t('recording_started'))
      } else {
        toast.success(t('recording_saved'))
      }
    }
  }

  return (
    <div className={cn("flex items-center gap-2 md:gap-3", onlySelects && "w-full justify-center mt-2 flex-wrap", className)}>
      {!onlySelects && (
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      )}

      {(onlySelects || (!onlyActions && !onlySelects)) && (
        <div className={cn("flex items-center gap-2 flex-wrap", !onlySelects && "hidden md:flex")}>
          <Select value={executionType} onValueChange={setExecutionType}>
            <SelectTrigger className="h-9 md:h-12 px-4 md:px-6 bg-muted/60 hover:bg-muted border-0 rounded-2xl text-foreground font-medium w-fit gap-2 md:gap-3 transition-all text-sm md:text-base cursor-pointer shadow-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={8} className="rounded-2xl border-border bg-background min-w-[160px] p-1 shadow-lg">
              <SelectItem value="report" className="cursor-pointer rounded-xl"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Report</div></SelectItem>
              <SelectItem value="analysis" className="cursor-pointer rounded-xl"><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-orange-500" /> Analysis</div></SelectItem>
              <SelectItem value="summary" className="cursor-pointer rounded-xl"><div className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-green-500" /> Summary</div></SelectItem>
              <SelectItem value="chat" className="cursor-pointer rounded-xl"><div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Chat</div></SelectItem>
              <SelectItem value="classification" className="cursor-pointer rounded-xl"><div className="flex items-center gap-2"><Scissors className="w-4 h-4 text-pink-500" /> Classification</div></SelectItem>
            </SelectContent>
          </Select>

          {executionType === "report" && (
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="h-9 md:h-12 px-4 md:px-6 bg-muted/60 hover:bg-muted border-0 rounded-2xl text-foreground font-medium w-fit gap-2 md:gap-3 transition-all text-sm md:text-base cursor-pointer shadow-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={8} className="rounded-2xl border-border bg-background min-w-[140px] p-1 shadow-lg">
                <SelectItem value="all" className="cursor-pointer rounded-xl">All</SelectItem>
                <SelectItem value="financial" className="cursor-pointer rounded-xl">Financial</SelectItem>
                <SelectItem value="legal" className="cursor-pointer rounded-xl">Legal</SelectItem>
                <SelectItem value="marketing" className="cursor-pointer rounded-xl">Marketing</SelectItem>
                <SelectItem value="revenue" className="cursor-pointer rounded-xl">Revenue</SelectItem>
                <SelectItem value="technical" className="cursor-pointer rounded-xl">Technical</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={selectedModelId} onValueChange={setSelectedModelId}>
            <SelectTrigger className="h-9 md:h-12 px-4 md:px-6 bg-muted/60 hover:bg-muted border-0 rounded-2xl text-foreground font-medium w-fit gap-2 md:gap-3 transition-all text-sm md:text-base cursor-pointer shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={8} className="rounded-2xl border-border bg-background min-w-[180px] p-1 shadow-lg">
              {models.map(model => (
                <SelectItem key={model.model_id} value={model.model_id} className="cursor-pointer rounded-xl">
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!onlyActions && !onlySelects && <div className="flex-1 hidden md:block" />}

      {(onlyActions || (!onlyActions && !onlySelects)) && (
        <div className={cn("flex items-center gap-3", onlyActions && "ml-auto")}>
          <div className="flex items-center gap-1 md:gap-2 bg-muted/60 text-foreground rounded-xl md:rounded-2xl p-1 md:p-1.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMicClick}
              className={`h-7 w-7 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-background cursor-pointer transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : ''}`}
            >
              <Mic strokeWidth={2.5} className={`w-4! h-4! md:w-5! md:h-5! ${isRecording ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={triggerFileInput}
              className="h-7 w-7 md:h-9 md:w-9 rounded-lg md:rounded-xl hover:bg-background cursor-pointer"
            >
              <Plus className="w-4! h-4! md:w-5! md:h-5! text-foreground bg-foreground/10 rounded-md" />
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={onSend}
            isLoading={isLoading}
            className="h-9 md:h-12 px-4 md:px-7 rounded-xl md:rounded-2xl text-foreground gap-2 cursor-pointer bg-muted/60 hover:bg-muted font-semibold shadow-sm transition-all active:scale-95"
          >
            <span className="text-sm md:text-base">{t('send')}</span>
            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-md text-foreground bg-foreground/10">
              {locale === 'ar' ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
