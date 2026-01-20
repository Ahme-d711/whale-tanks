"use client"

import React, { useRef, useState } from 'react'
import { motion } from "motion/react"
import { Info, Mic, ArrowUpRight, ArrowUpLeft, Plus, FileIcon, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'

export default function DashboardIdeaAnalyzer() {
  const locale = useLocale()
  const t = useTranslations('HomePage.Analyzer')
  const [ideaText, setIdeaText] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleToggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
          setAttachments(prev => [...prev, file])
          stream.getTracks().forEach(track => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        console.error("Mic error:", err)
      }
    }
  }

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setAttachments(prev => [...prev, ...files])
      e.target.value = '' // Reset input
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = () => {
    console.log("Dashboard Sending Idea Data:", {
      text: ideaText,
      attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
      timestamp: new Date().toISOString()
    })
    setIdeaText('')
    setAttachments([])
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
          className="w-full h-full min-h-[114px] placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-lg font-medium text-foreground leading-snug shadow-none"
          placeholder={t('title')}
        />
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div key={index} className="relative group bg-border/50 rounded-lg p-1 flex items-center gap-2 pr-1.5">
              <div className="w-6 h-6 relative rounded overflow-hidden bg-background shrink-0 flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  <Image 
                    src={URL.createObjectURL(file)} 
                    alt="preview" 
                    fill 
                    className="object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                ) : (
                  <FileIcon className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <span className="text-[10px] max-w-[80px] truncate text-foreground/80 font-medium">
                {file.name}
              </span>
              <button 
                onClick={() => handleRemoveAttachment(index)}
                className="p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <input 
          type="file" 
          multiple 
          hidden 
          ref={fileInputRef} 
          onChange={handleFilesSelected} 
        />
        
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
          <button 
            onClick={handleToggleRecording}
            className={`text-foreground hover:opacity-70 transition-all ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
          >
            <Mic strokeWidth={3} className={`w-4 h-4 ${isRecording ? 'fill-current' : ''}`} />
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
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
