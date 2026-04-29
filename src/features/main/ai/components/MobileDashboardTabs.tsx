"use client"

import { useState } from 'react'
import { ChatDisplay } from './ChatDisplay'
import DashboardIdeaAnalyzer from './DashboardIdeaAnalyzer'
import ActionSelector from './ActionSelector'
import DynamicDisplayArea from './DynamicDisplayArea'
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


  return (
    <div className="w-full flex flex-col gap-4 lg:hidden h-screen overflow-hidden">
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

        {activeTab === 'builder' && (
          <div className="flex flex-col gap-0 -mx-2 -mb-28 min-h-[calc(100vh-200px)]">
            <div className="px-2 pb-2">
              <ActionSelector 
                activeAction={activeAction}
                setActiveAction={setActiveAction}
                activeSubAction={activeSubAction}
                setActiveSubAction={setActiveSubAction}
                canView={canView}
              />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <DynamicDisplayArea analyzer={analyzer} />
            </div>
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
