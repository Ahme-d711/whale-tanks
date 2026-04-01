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

interface AnalyzerToolbarProps {
  isRecording: boolean
  onToggleRecording: () => void
  onFilesSelectedDirect: (files: File[]) => void
  onSend: () => void
  triggerFileInput: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isLoading?: boolean
  executionType: string
  setExecutionType: (value: any) => void
  analysisType: string
  setAnalysisType: (value: string) => void
  models: AIModel[]
  selectedModelId: string
  setSelectedModelId: (value: string) => void
}

export const AnalyzerToolbar = ({ 
  isRecording, 
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
  setSelectedModelId
}: AnalyzerToolbarProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onFilesSelectedDirect(files)
      toast.success(t('files_attached', { count: files.length }))
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

  const getExecutionIcon = (type: string) => {
    switch (type) {
      case "report": return <FileText className="w-4 h-4 text-blue-500" />
      case "analysis": return <BarChart3 className="w-4 h-4 text-orange-500" />
      case "summary": return <ClipboardList className="w-4 h-4 text-green-500" />
      case "chat": return <MessageSquare className="w-4 h-4 text-purple-500" />
      case "classification": return <Scissors className="w-4 h-4 text-pink-500" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-2">
        <Select value={executionType} onValueChange={setExecutionType}>
          <SelectTrigger className="h-10 px-3 bg-secondary border-0 rounded-2xl text-foreground font-medium w-fit gap-2 transition-all">
            <SelectValue placeholder="Execution Type" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="rounded-xl border-border bg-background min-w-[160px]">
            <SelectItem value="report" className="cursor-pointer gap-2"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Report</div></SelectItem>
            <SelectItem value="analysis" className="cursor-pointer gap-2"><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-orange-500" /> Analysis</div></SelectItem>
            <SelectItem value="summary" className="cursor-pointer gap-2"><div className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-green-500" /> Summary</div></SelectItem>
            <SelectItem value="chat" className="cursor-pointer gap-2"><div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Chat</div></SelectItem>
            <SelectItem value="classification" className="cursor-pointer gap-2"><div className="flex items-center gap-2"><Scissors className="w-4 h-4 text-pink-500" /> Classification</div></SelectItem>
          </SelectContent>
        </Select>

        {executionType === "report" && (
           <Select value={analysisType} onValueChange={setAnalysisType}>
             <SelectTrigger className="h-10 px-3 bg-border border-0 rounded-2xl text-foreground font-medium w-fit gap-2 transition-all">
               <SelectValue placeholder="Analysis Type" />
             </SelectTrigger>
             <SelectContent position="popper" sideOffset={4} className="rounded-xl border-border bg-background min-w-[140px]">
               <SelectItem value="financial" className="cursor-pointer"><div className="flex items-center gap-2">Financial</div></SelectItem>
               <SelectItem value="legal" className="cursor-pointer"><div className="flex items-center gap-2">Legal</div></SelectItem>
               <SelectItem value="marketing" className="cursor-pointer"><div className="flex items-center gap-2">Marketing</div></SelectItem>
               <SelectItem value="revenue" className="cursor-pointer"><div className="flex items-center gap-2">Revenue</div></SelectItem>
               <SelectItem value="technical" className="cursor-pointer"><div className="flex items-center gap-2">Technical</div></SelectItem>
             </SelectContent>
           </Select>
        )}

        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
          <SelectTrigger className="h-10 px-3 bg-border border-0 rounded-2xl text-foreground font-medium w-fit gap-2 transition-all">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="rounded-xl border-border bg-background min-w-[180px]">
             {models.map(model => (
               <SelectItem key={model.model_id} value={model.model_id} className="cursor-pointer">
                 {model.name}
               </SelectItem>
             ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1" />

      {/* Action Buttons - Grouped */}
      <div className="flex items-center gap-2 bg-border text-foreground rounded-2xl p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMicClick}
          className={`h-8 w-8 rounded-xl hover:bg-background cursor-pointer transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : ''}`}
        >
          <Mic strokeWidth={3} className={`w-5! h-5! ${isRecording ? 'fill-current' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={triggerFileInput}
          className="h-8 w-8 rounded-xl hover:bg-background cursor-pointer"
        >
          <Plus className="w-5! h-5! text-foreground bg-foreground/30 rounded-sm" />
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={onSend}
        isLoading={isLoading}
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
