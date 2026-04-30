"use client"

import React from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import WebBuilder from './WebBuilder'

interface DynamicDisplayAreaProps {
  analyzer: any
}

export default function DynamicDisplayArea({ analyzer }: DynamicDisplayAreaProps) {
  const t = useTranslations('WebBuilder')
  const { 
    isHistoryLoading,
    webBuilderBlocks,
    activeBlockIndex,
    setActiveBlockIndex,
    dbBlocks,
    activeDbBlockIndex,
    setActiveDbBlockIndex,
    activeAction,
    activeSubAction,
  } = analyzer

  return (
    <div className="w-full flex-1 bg-transparent lg:bg-white lg:backdrop-blur-md lg:rounded-3xl lg:border lg:border-primary lg:shadow-xl lg:shadow-blue-500/5 overflow-hidden flex flex-col min-h-0">
      <div className="flex-1 h-full lg:border lg:border-primary lg:rounded-2xl bg-transparent lg:bg-white overflow-hidden flex flex-col">
        {isHistoryLoading ? (
          <div className="p-8 h-full flex flex-col gap-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-zinc-100 rounded-lg" />
              <div className="h-6 w-24 bg-zinc-100 rounded-lg" />
            </div>
            <div className="flex-1 w-full bg-zinc-50 rounded-xl border border-zinc-100 p-4 space-y-3">
              <div className="h-3 w-[80%] bg-zinc-200/50 rounded" />
              <div className="h-3 w-[60%] bg-zinc-200/50 rounded" />
              <div className="h-3 w-[90%] bg-zinc-200/50 rounded" />
              <div className="h-3 w-[40%] bg-zinc-200/50 rounded" />
              <div className="space-y-2 pt-4">
                <div className="h-3 w-[70%] bg-zinc-200/30 rounded" />
                <div className="h-3 w-[50%] bg-zinc-200/30 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-zinc-100" />
              <div className="h-4 w-24 bg-zinc-100 rounded" />
            </div>
          </div>
        ) : activeAction === 'web_builder' ? (
          <WebBuilder 
            blocks={webBuilderBlocks} 
            activeIndex={activeBlockIndex}
            onIndexChange={setActiveBlockIndex}
            dbBlocks={dbBlocks}
            activeDbIndex={activeDbBlockIndex}
            onDbIndexChange={setActiveDbBlockIndex}
            activeSubAction={activeSubAction} 
            sessionId={analyzer.sessionId}
          />
        ) : (
          <div className="p-5 h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-bold">{t('consultation_mode')}</h4>
            <p className="max-w-[280px] text-sm text-muted-foreground">{t('consultation_desc')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
