"use client"

import React from 'react'
import TankSelector from './TankSelector'
import AdvisorSelector from './AdvisorSelector'
import ActionSelector from './ActionSelector'

export default function DashboardHeader() {
  const [activeTankId, setActiveTankId] = React.useState('startup')

  return (
    <header className="relative z-10 px-8 py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <TankSelector activeTankId={activeTankId} onTankChange={setActiveTankId} />
        <AdvisorSelector activeTankId={activeTankId} />
      </div>
    </header>
  )
}
