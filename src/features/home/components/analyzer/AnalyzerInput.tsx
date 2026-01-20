"use client"

import React from 'react'
import { Info, X, FileIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image'
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
  attachments?: File[]
  onRemoveAttachment?: (index: number) => void
}

export const AnalyzerInput = ({ value, onChange, maxLength = 500, attachments = [], onRemoveAttachment }: AnalyzerInputProps) => {
  const t = useTranslations('HomePage.Analyzer')
  const locale = useLocale()

  return (
    <div className="relative mb-4">
      <div className={cn(
        "absolute top-0 flex items-center gap-1 text-xs font-medium text-foreground select-none",
        locale === 'ar' ? "left-0" : "right-0"
      )}>
        <span>0/500</span>
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
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full min-h-20 placeholder:text-secondary-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none bg-transparent text-xl! font-normal text-foreground leading-tight shadow-none",
          locale === 'ar' ? "pl-20" : "pr-20"
        )}
        placeholder={t('title')}
      />
      
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attachments.map((file, index) => (
            <div key={index} className="relative group bg-border/50 rounded-lg p-1.5 flex items-center gap-2 pr-2">
              <div className="w-8 h-8 relative rounded overflow-hidden bg-background shrink-0 flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  <Image 
                    src={URL.createObjectURL(file)} 
                    alt="preview" 
                    fill 
                    className="object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                ) : (
                  <FileIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <span className="text-xs max-w-[100px] truncate text-foreground/80" title={file.name}>
                {file.name}
              </span>
              <button 
                onClick={() => onRemoveAttachment?.(index)}
                className="ml-1 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                type="button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
