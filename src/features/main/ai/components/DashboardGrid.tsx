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
    webBuilderCode,
    activeAction,
    setActiveAction,
    activeSubAction,
    setActiveSubAction
  } = analyzer

  return (
    <section className="relative z-10 flex-1 px-4 pb-4 flex gap-6 overflow-hidden py-4 max-w-full">
      {/* Container for three columns */}
      <div className="flex-1 flex max-w-full gap-6">
        {/* Left Column - Tall Container */}
        <div className="w-[45%] flex flex-col gap-4 overflow-hidden">
          <TankSelector activeTankId={activeTankId} onTankChange={onTankChange} />
          <ActionSelector 
            activeAction={activeAction}
            setActiveAction={setActiveAction}
            activeSubAction={activeSubAction}
            setActiveSubAction={setActiveSubAction}
          />
          <div className="w-full flex-1 bg-white backdrop-blur-md rounded-3xl border border-primary shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 h-full border border-primary rounded-2xl bg-white overflow-hidden flex flex-col">
              {activeAction === 'web_builder' ? (
                <WebBuilder code={webBuilderCode} activeSubAction={activeSubAction} />
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
        <div className="w-[55%] flex flex-col gap-6 h-full overflow-hidden">
          <ChatDisplay 
            messages={messages} 
            isLoading={isLoading} 
            isHistoryLoading={isHistoryLoading} 
            activeAction={activeAction}
          />
          <DashboardIdeaAnalyzer analyzer={analyzer} />
        </div>
      </div>

      {/* Right Column - Vertical AdvisorSelector & Projects */}
      <div className="pr-4 flex flex-col justify-between gap-4">
        <AdvisorSelector activeTankId={activeTankId} />
        <PreviousProjects />
        <SubscriptionUpsell />
      </div>
    </section>
  )
}

