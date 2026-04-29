"use client"

import React, { useState } from 'react'
import { MessageSquare, Layout, Users } from 'lucide-react'
import { ChatDisplay } from './ChatDisplay'
import DashboardIdeaAnalyzer from './DashboardIdeaAnalyzer'
import ActionSelector from './ActionSelector'
import DynamicDisplayArea from './DynamicDisplayArea'
import AdvisorSelector from './AdvisorSelector'
import SubscriptionUpsell from './SubscriptionUpsell'
import TankSelector from './TankSelector'

export default function MobileDashboardTabs({ analyzer, activeTankId, onTankChange }: any) {
  const [activeTab, setActiveTab] = useState<'chat' | 'builder' | 'advisors'>('chat')

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

  const showBuilderTab = activeAction === 'web_builder'

  return (
    <div className="w-full flex flex-col gap-4 lg:hidden h-[calc(100vh-120px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-2 pt-2 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-28">
        <div className="px-1">
          <TankSelector activeTankId={activeTankId} onTankChange={onTankChange} />
        </div>
        {activeTab === 'chat' && (
          <div className="flex-1 min-h-[300px]">
            <ChatDisplay 
              messages={messages} 
              isLoading={isLoading} 
              isHistoryLoading={isHistoryLoading} 
              activeAction={activeAction}
            />
          </div>
        )}

        {activeTab === 'builder' && showBuilderTab && (
          <div className="flex flex-col gap-4">
            <ActionSelector 
              activeAction={activeAction}
              setActiveAction={setActiveAction}
              activeSubAction={activeSubAction}
              setActiveSubAction={setActiveSubAction}
              canView={canView}
            />
            <DynamicDisplayArea analyzer={analyzer} />
          </div>
        )}
      </div>

      {activeTab === 'chat' && (
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-4 bg-transparent pt-6 z-20">
          <DashboardIdeaAnalyzer analyzer={analyzer} />
        </div>
      )}
    </div>
  )
}
