"use client"

import ActionSelector from './ActionSelector'
import DashboardIdeaAnalyzer from './DashboardIdeaAnalyzer'
import AdvisorSelector from './AdvisorSelector'
import TankSelector from './TankSelector'
import PreviousProjects from './PreviousProjects'
import SubscriptionUpsell from './SubscriptionUpsell'

interface DashboardGridProps {
  activeTankId: string
  onTankChange: (id: string) => void
}

export default function DashboardGrid({ activeTankId, onTankChange }: DashboardGridProps) {
  return (
    <section className="relative z-10 flex-1 px-6 pb-4 flex gap-6 overflow-hidden py-4">
      {/* Container for three columns */}
      <div className="flex-1 flex gap-12">
        {/* Left Column - Tall Container */}
        <div className="w-1/2 flex flex-col gap-4">
          <TankSelector activeTankId={activeTankId} onTankChange={onTankChange} />
          <ActionSelector />
          <div className="w-full flex-1 bg-white backdrop-blur-md rounded-3xl border border-primary shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col">
            <div className="p-5 h-full border border-primary rounded-2xl bg-white" />
          </div>
        </div>

        {/* Center Column - Right Column in previous layout */}
        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-white backdrop-blur-md rounded-3xl h-full border border-primary shadow-xl shadow-blue-500/5 flex flex-col overflow-hidden">
             <div className="p-5 h-full border border-primary rounded-2xl bg-white" />
          </div>
          
          <DashboardIdeaAnalyzer />
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

