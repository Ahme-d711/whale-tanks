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
import { Sparkles } from 'lucide-react'

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
            {activeAction === 'web_builder' ? (
              <WebBuilder 
                blocks={webBuilderBlocks} 
                activeIndex={activeBlockIndex}
                onIndexChange={setActiveBlockIndex}
                activeSubAction={activeSubAction} 
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

