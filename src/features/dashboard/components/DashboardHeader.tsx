"use client"

import React from 'react'
import TankSelector from './TankSelector'
import AdvisorSelector from './AdvisorSelector'

export default function DashboardHeader() {
  const [activeTankId, setActiveTankId] = React.useState('startup')

  return (
    <header className="relative z-10 px-8 py-6 flex gap-6 items-end">
      <div className="w-3/8">
        <TankSelector activeTankId={activeTankId} onTankChange={setActiveTankId} />
      </div>
      <div className="w-5/8">
        <AdvisorSelector activeTankId={activeTankId} />
      </div>
    </header>
  )
}
