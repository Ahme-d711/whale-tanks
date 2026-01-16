"use client"

import React from 'react'
import { Crown, Scale, Wallet, Cpu, Brain, TrendingUp, UserRoundSearch } from 'lucide-react'
import { Button } from "@/components/ui/button"

const advisors = [
  { id: 'chairman', icon: Crown, label: 'AI Chairman', active: true },
  { id: 'legal', icon: Scale, label: 'Legal Advisor' },
  { id: 'financial', icon: Wallet, label: 'Financial Advisor' },
  { id: 'technical', icon: Cpu, label: 'Technical Advisor' },
  { id: 'psychological', icon: Brain, label: 'Psychological Advisor' },
  { id: 'marketing', icon: TrendingUp, label: 'Marketing Advisor' },
  { id: 'investor1', icon: UserRoundSearch, label: 'Invertors 1' },
  { id: 'investor2', icon: UserRoundSearch, label: 'Invertors 2' },
  { id: 'investor3', icon: UserRoundSearch, label: 'Invertors 3' },
]

interface AdvisorSelectorProps {
  activeTankId: string
}

export default function AdvisorSelector({ activeTankId }: AdvisorSelectorProps) {
  const [activeAdvisor, setActiveAdvisor] = React.useState('chairman')

  const filteredAdvisors = React.useMemo(() => {
    if (activeTankId === 'tech') {
      return advisors.filter(a => a.id === 'chairman' || a.id === 'technical')
    }
    if (activeTankId === 'investor') {
      return advisors.filter(a => a.id === 'chairman' || a.id.startsWith('investor'))
    }
    if (activeTankId === 'startup') {
      return advisors.filter(a => !a.id.startsWith('investor'))
    }
    return advisors
  }, [activeTankId])

  return (
    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm p-1.5 rounded-[24px] border border-border shadow-sm overflow-x-auto no-scrollbar max-w-[70%]">
      {filteredAdvisors.map((advisor) => {
        const Icon = advisor.icon
        return (
          <Button
            key={advisor.id}
            onClick={() => setActiveAdvisor(advisor.id)}
            className={`h-10 px-4 gap-2 rounded-full font-medium text-sm shrink-0 cursor-pointer transition-all duration-300 ${
              activeAdvisor === advisor.id 
                ? 'bg-secondary text-primary hover:bg-white border font-bold' 
                : 'text-secondary-foreground hover:bg-secondary/50'
            }`}
            variant={activeAdvisor === advisor.id ? "default" : "ghost"}
          >
            <Icon className="w-4 h-4" />
            {advisor.label}
          </Button>
        )
      })}
    </div>
  )
}
