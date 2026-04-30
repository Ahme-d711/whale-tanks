"use client"

import ActionSelector from './ActionSelector'
import DashboardIdeaAnalyzer from './DashboardIdeaAnalyzer'
import AdvisorSelector from './AdvisorSelector'
import TankSelector from './TankSelector'
import SubscriptionUpsell from './SubscriptionUpsell'
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'
import { ChatDisplay } from './ChatDisplay'

import DynamicDisplayArea from './DynamicDisplayArea'
import MobileDashboardTabs from './MobileDashboardTabs'

interface DashboardGridProps {
  activeTankId: string
  onTankChange: (id: string) => void
  analyzer?: any
  activeTab?: 'chat' | 'builder'
  onTabChange?: (tab: 'chat' | 'builder') => void
}

export default function DashboardGrid({ 
  activeTankId, 
  onTankChange, 
  analyzer: passedAnalyzer,
  activeTab,
  onTabChange
}: DashboardGridProps) {
  const localAnalyzer = useIdeaAnalyzer((data) => {
    console.log("Chat Response Received:", data)
  })

  const analyzer = passedAnalyzer || localAnalyzer;

  const { 
    messages, 
    isLoading, 
    isHistoryLoading,
    activeAction,
    setActiveAction,
    activeSubAction,
    setActiveSubAction,
    canView
  } = analyzer

  return (
    <section className="relative z-10 flex-1 md:px-4 pb-0 md:pb-4 flex gap-4 overflow-hidden md:py-4 max-w-full">
      {/* Mobile Tabs (visible on responsive screens) */}
      <MobileDashboardTabs 
        analyzer={analyzer} 
        activeTankId={activeTankId} 
        onTankChange={onTankChange} 
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Left Column - Tall Container (Web Builder / Action Selector) */}
      <div className="hidden lg:flex w-[40%] min-w-[320px] flex-col gap-4 overflow-hidden">
        <TankSelector activeTankId={activeTankId} onTankChange={onTankChange} />
        <ActionSelector 
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          activeSubAction={activeSubAction}
          setActiveSubAction={setActiveSubAction}
          canView={canView}
        />
        <DynamicDisplayArea analyzer={analyzer} />
      </div>

      {/* Center Column - Chat Display */}
      <div className="hidden lg:flex flex-1 min-w-[400px] flex-col gap-6 h-full overflow-hidden">
        <ChatDisplay 
          messages={messages} 
          isLoading={isLoading} 
          isHistoryLoading={isHistoryLoading} 
          activeAction={activeAction}
        />
        <DashboardIdeaAnalyzer analyzer={analyzer} />
      </div>

      {/* Right Column - Vertical AdvisorSelector & Projects */}
      <div className="w-64 shrink-0 hidden 2xl:flex flex-col justify-between gap-7 overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <AdvisorSelector />
        </div>
        <SubscriptionUpsell />
      </div>
    </section>
  )
}
