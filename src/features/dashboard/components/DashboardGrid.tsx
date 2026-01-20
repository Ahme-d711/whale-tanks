"use client"

import ActionSelector from './ActionSelector'
import DashboardIdeaAnalyzer from './DashboardIdeaAnalyzer'
import AdvisorSelector from './AdvisorSelector'
import TankSelector from './TankSelector'

interface DashboardGridProps {
  activeTankId: string
  onTankChange: (id: string) => void
}

export default function DashboardGrid({ activeTankId, onTankChange }: DashboardGridProps) {
  return (
    <section className="relative z-10 flex-1 px-6 pb-4 flex gap-12 overflow-hidden py-4">
      {/* Left Column - Tall Container */}
      <div className="w-1/2 flex flex-col gap-4">
        <TankSelector activeTankId={activeTankId} onTankChange={onTankChange} />
        <ActionSelector />
        <div className="w-full flex-1 bg-white backdrop-blur-md rounded-3xl border border-primary shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col">
          <div className="p-5 h-full border border-primary rounded-2xl bg-white" />
        </div>
      </div>

      {/* Right Column - Top card + IdeaAnalyzer */}
      <div className="w-1/2 flex flex-col gap-4">
        {/* Top Right - Advisor Selector directly above box */}
        <AdvisorSelector activeTankId={activeTankId} />
        <div className="bg-white backdrop-blur-md rounded-3xl h-full border border-primary shadow-xl shadow-blue-500/5 flex flex-col overflow-hidden">
           <div className="p-5 h-full border border-primary rounded-2xl bg-white" />
        </div>
        
        {/* Bottom Right - IdeaAnalyzer */}
           <DashboardIdeaAnalyzer />
      </div>
    </section>
  )
}

