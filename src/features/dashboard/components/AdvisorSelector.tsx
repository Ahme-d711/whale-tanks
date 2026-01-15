"use client"

import React from 'react'
import { Crown, Scale, Wallet, Cpu, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function AdvisorSelector() {
  const advisors = [
    { id: 'chairman', icon: Crown, label: 'AI Chairman', active: true },
    { id: 'legal', icon: Scale, label: 'Legal Advisor' },
    { id: 'financial', icon: Wallet, label: 'Financial Advisor' },
    { id: 'technical', icon: Cpu, label: 'Technical Advisor' },
    { id: 'psychological', icon: Brain, label: 'Psychological Advisor' },
  ]

  return (
    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm p-1.5 rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-x-auto no-scrollbar max-w-[60%]">
      {advisors.map((advisor) => {
        const Icon = advisor.icon
        return (
          <Button
            key={advisor.id}
            className={`h-10 px-4 gap-2 rounded-full font-medium shrink-0 ${
              advisor.active 
                ? 'bg-[#2260FF] text-white hover:bg-[#2260FF]/90' 
                : 'text-[#64748B] hover:bg-white/50'
            }`}
            variant={advisor.active ? "default" : "ghost"}
          >
            <Icon className="w-4 h-4" />
            {advisor.label}
          </Button>
        )
      })}
    </div>
  )
}
