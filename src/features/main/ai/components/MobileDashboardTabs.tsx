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

export default function MobileDashboardTabs({ 
  analyzer, 
  activeTankId, 
  onTankChange,
  activeTab: passedActiveTab,
  onTabChange
}: any) {
  const [localActiveTab, setLocalActiveTab] = useState<'chat' | 'builder'>('chat')

  const activeTab = passedActiveTab || localActiveTab
  const setActiveTab = onTabChange || setLocalActiveTab

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
        <div className="px-1 flex justify-center mb-2">
          <div className="flex p-1 bg-zinc-100/80 backdrop-blur rounded-xl gap-1 w-full max-w-[320px] border border-zinc-200/50 shadow-sm">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'chat' ? 'bg-white text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              المحادثة
            </button>
            <button 
              onClick={() => setActiveTab('builder')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'builder' ? 'bg-white text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Web Builder
            </button>
          </div>
        </div>

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

        {activeTab === 'builder' && (
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
