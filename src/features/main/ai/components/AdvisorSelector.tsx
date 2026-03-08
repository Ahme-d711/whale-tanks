"use client"

import React from 'react'
import Image from 'next/image'
import { Crown, Scale, Wallet, Cpu, Brain, TrendingUp, UserRoundSearch } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'

const advisors = [
  { id: 'chairman', icon: '/icons/crown.svg', label: 'AI Chairman', active: true },
  { id: 'legal', icon: '/icons/legal-icon.svg', label: 'Legal Advisor' },
  { id: 'financial', icon: '/icons/financial-icon.svg', label: 'Financial Advisor' },
  { id: 'technical', icon: '/icons/technical-icon.svg', label: 'Technical Advisor' },
  { id: 'psychological', icon: '/icons/psychological-icon.svg', label: 'Psychological Advisor' },
  { id: 'marketing', icon: '/icons/marketing-icon.svg', label: 'Marketing Advisor' },
  { id: 'investor1', icon: UserRoundSearch, label: 'Invertors 1', isLucide: true },
  { id: 'investor2', icon: UserRoundSearch, label: 'Invertors 2', isLucide: true },
  { id: 'investor3', icon: UserRoundSearch, label: 'Invertors 3', isLucide: true },
]

interface AdvisorSelectorProps {
  activeTankId: string
}

export default function AdvisorSelector({ activeTankId }: AdvisorSelectorProps) {
  const [activeAdvisor, setActiveAdvisor] = React.useState('chairman')
  const t = useTranslations('Dashboard.Advisors')

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
    <div className="flex flex-col gap-1.5 bg-white/80 w-64 backdrop-blur-sm p-4 rounded-[32px] border border-border shadow-sm overflow-y-auto overflow-x-hidden thin-scrollbar h-fit max-h-[calc(100vh-200px)]">
      <div className="px-2 pb-2 mb-2 border-b border-border/50">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {activeTankId === 'investor' ? t('title_investor') : t('title_council')}
        </h3>
        <p className="text-[10px] text-muted-foreground font-medium">
          {t('description')}
        </p>
      </div>
      {filteredAdvisors.map((advisor) => {
        const Icon = advisor.icon
        const isActive = activeAdvisor === advisor.id
        const isLucide = 'isLucide' in advisor && advisor.isLucide

        return (
          <Button
            key={advisor.id}
            onClick={() => setActiveAdvisor(advisor.id)}
            className={`w-full h-10 px-3 justify-start rounded-full flex items-center gap-2 shrink-0 cursor-pointer transition-all duration-300 ${
              isActive 
                ? 'bg-secondary text-primary hover:bg-white border font-bold' 
                : 'text-secondary-foreground hover:bg-secondary/50'
            }`}
            variant={isActive ? "default" : "ghost"}
          >
            {isLucide ? (
              <advisor.icon className="w-5 h-5 shrink-0" />
            ) : (
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                <Image 
                  src={advisor.icon as string} 
                  alt={advisor.label} 
                  width={20} 
                  height={20} 
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-xs font-semibold truncate">{advisor.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
