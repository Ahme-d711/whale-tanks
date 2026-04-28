"use client"

import ActionSelector from './ActionSelector'
import DashboardIdeaAnalyzer from './DashboardIdeaAnalyzer'
import AdvisorSelector from './AdvisorSelector'
import TankSelector from './TankSelector'
import PreviousProjects from './PreviousProjects'
import SubscriptionUpsell from './SubscriptionUpsell'
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'
import { ChatDisplay } from './ChatDisplay'
import WebBuilder from './WebBuilder'
import PreviewView from './web-builder/PreviewView'
import { Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DashboardGridProps {
  activeTankId: string
  onTankChange: (id: string) => void
}

export default function DashboardGrid({ activeTankId, onTankChange }: DashboardGridProps) {
  const analyzer = useIdeaAnalyzer((data) => {
    console.log("Chat Response Received:", data)
  })

  const { 
    messages, 
    isLoading, 
    isHistoryLoading,
    webBuilderBlocks,
    activeBlockIndex,
    setActiveBlockIndex,
    dbBlocks,
    activeDbBlockIndex,
    setActiveDbBlockIndex,
    activeAction,
    setActiveAction,
    activeSubAction,
    setActiveSubAction,
    canView
  } = analyzer

  return (
    <section className="relative z-10 flex-1 px-4 pb-4 flex gap-4 overflow-hidden py-4 max-w-full">
      {/* Left Column - Tall Container (Web Builder / Action Selector) */}
      <div className="w-[40%] min-w-[320px] flex flex-col gap-4 overflow-hidden">
        <TankSelector activeTankId={activeTankId} onTankChange={onTankChange} />
        <ActionSelector 
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          activeSubAction={activeSubAction}
          setActiveSubAction={setActiveSubAction}
          canView={canView}
        />
        <div className="w-full flex-1 bg-white backdrop-blur-md rounded-3xl border border-primary shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 h-full border border-primary rounded-2xl bg-white overflow-hidden flex flex-col">
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
                <h4 className="text-lg font-bold">Consultation Mode</h4>
                <p className="max-w-[280px] text-sm text-muted-foreground">Ask questions, brainstorm ideas, and refine your business strategy with AI advisors.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Column - Chat Display */}
      <div className="flex-1 min-w-[400px] flex flex-col gap-6 h-full overflow-hidden">
        <ChatDisplay 
          messages={messages} 
          isLoading={isLoading} 
          isHistoryLoading={isHistoryLoading} 
          activeAction={activeAction}
        />
        <DashboardIdeaAnalyzer analyzer={analyzer} />
      </div>

      {/* Right Column - Vertical AdvisorSelector & Projects */}
      <div className="w-64 shrink-0 flex flex-col justify-between gap-4 overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <AdvisorSelector activeTankId={activeTankId} />
          <PreviousProjects />
        </div>
        <SubscriptionUpsell />
      </div>
    </section>
  )
}
