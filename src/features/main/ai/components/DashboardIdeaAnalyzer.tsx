"use client"

import { motion } from "motion/react"
import { Mic, ArrowUpRight, ArrowUpLeft, Plus } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'
import { AttachmentList } from '@/components/shared/analyzer/AttachmentList'
import { AnalyzerCounter } from '@/components/shared/analyzer/AnalyzerCounter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, MessageSquare, ClipboardList, Scissors, FileText, CheckCircle2, Sparkles } from 'lucide-react'

interface DashboardIdeaAnalyzerProps {
  analyzer: ReturnType<typeof useIdeaAnalyzer>
}

export default function DashboardIdeaAnalyzer({ analyzer }: DashboardIdeaAnalyzerProps) {
  const locale = useLocale()
  const t = useTranslations('HomePage.Analyzer')
  
  const {
    ideaText,
    setIdeaText,
    attachments,
    isRecording,
    fileInputRef,
    isLoading,
    executionType,
    setExecutionType,
    analysisType,
    setAnalysisType,
    models,
    selectedModelId,
    setSelectedModelId,
    handleToggleRecording,
    handleFilesSelected,
    handleRemoveAttachment,
    handleSend,
    triggerFileInput
  } = analyzer

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
          onKeyDown={handleKeyDown}
          className="w-full h-full min-h-[126px] placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-lg font-medium text-foreground leading-snug shadow-none"
          placeholder={t('title')}
        />
      </div>

      <AttachmentList 
        attachments={attachments} 
        onRemove={handleRemoveAttachment} 
        size="sm"
      />

      <div className="flex items-center justify-between gap-2 text-foreground">
        <input 
          type="file" 
          multiple 
          hidden 
          ref={fileInputRef} 
          onChange={handleFilesSelected} 
        />

        <div className="flex items-center gap-2">
          <Select value={executionType} onValueChange={(val) => setExecutionType(val as any)}>
            <SelectTrigger className="h-9 px-3 bg-border border-0 rounded-full text-foreground font-medium w-fit gap-2 transition-all text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="rounded-xl border-border bg-background min-w-[140px]">
              <SelectItem value="report" className="cursor-pointer text-xs"><div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-blue-500" /> Report</div></SelectItem>
              <SelectItem value="analysis" className="cursor-pointer text-xs"><div className="flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5 text-orange-500" /> Analysis</div></SelectItem>
              <SelectItem value="summary" className="cursor-pointer text-xs"><div className="flex items-center gap-2"><ClipboardList className="w-3.5 h-3.5 text-green-500" /> Summary</div></SelectItem>
              <SelectItem value="chat" className="cursor-pointer text-xs"><div className="flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Chat</div></SelectItem>
              <SelectItem value="classification" className="cursor-pointer text-xs"><div className="flex items-center gap-2"><Scissors className="w-3.5 h-3.5 text-pink-500" /> Classification</div></SelectItem>
            </SelectContent>
          </Select>

          {executionType === "report" && (
             <Select value={analysisType} onValueChange={setAnalysisType}>
               <SelectTrigger className="h-9 px-3 bg-border border-0 rounded-full text-foreground font-medium w-fit gap-2 transition-all text-xs">
                 <SelectValue placeholder="Analysis" />
               </SelectTrigger>
               <SelectContent position="popper" sideOffset={4} className="rounded-xl border-border bg-background min-w-[120px]">
                 <SelectItem value="all" className="cursor-pointer text-xs">All</SelectItem>
                 <SelectItem value="financial" className="cursor-pointer text-xs">Financial</SelectItem>
                 <SelectItem value="legal" className="cursor-pointer text-xs">Legal</SelectItem>
                 <SelectItem value="marketing" className="cursor-pointer text-xs">Marketing</SelectItem>
                 <SelectItem value="revenue" className="cursor-pointer text-xs">Revenue</SelectItem>
                 <SelectItem value="technical" className="cursor-pointer text-xs">Technical</SelectItem>
               </SelectContent>
             </Select>
          )}

          <Select value={selectedModelId} onValueChange={setSelectedModelId}>
            <SelectTrigger className="h-9 px-3 bg-border border-0 rounded-full text-foreground font-medium w-fit gap-2 transition-all text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="rounded-xl border-border bg-background min-w-[150px]">
               {models.map(model => (
                 <SelectItem key={model.model_id} value={model.model_id} className="cursor-pointer text-xs">
                   {model.name}
                 </SelectItem>
               ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
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
        </div>

        {/* Send Pill */}
        <button 
          onClick={() => handleSend()}
          disabled={isLoading}
          className="flex items-center gap-2 bg-border hover:bg-border/80 transition-colors rounded-full px-4 py-1.5 text-foreground font-medium text-sm disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <span>{t('send')}</span>
              <div className="w-5 h-5 flex items-center justify-center rounded-md text-foreground bg-foreground/30">
                {locale === 'ar' ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
