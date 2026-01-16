"use client"

import ActionSelector from './ActionSelector'
import DashboardIdeaAnalyzer from './DashboardIdeaAnalyzer'

export default function DashboardGrid() {
  return (
    <section className="relative z-10 flex-1 px-8 pb-8 flex gap-6 overflow-hidden">
      {/* Left Column - Tall Container */}
      <div className="w-1/2 flex flex-col gap-6">
        <ActionSelector />
        <div className="w-full flex-1 bg-white backdrop-blur-md rounded-[32px] border border-primary shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col">
          <div className="p-8 h-full border-2 border-primary rounded-[28px] bg-white" />
        </div>
      </div>

      {/* Right Column - Top card + IdeaAnalyzer */}
      <div className="w-1/2 flex flex-col gap-6">
        {/* Top Right Card */}
        <div className="flex-[1.5] bg-white backdrop-blur-md rounded-[32px] border border-primary shadow-xl shadow-blue-500/5 flex flex-col overflow-hidden">
           <div className="p-8 h-full border-2 border-primary rounded-[28px] bg-white" />
        </div>
        
        {/* Bottom Right - IdeaAnalyzer */}
        <div className="flex-1 min-h-[300px]">
           <DashboardIdeaAnalyzer />
        </div>
      </div>
    </section>
  )
}

