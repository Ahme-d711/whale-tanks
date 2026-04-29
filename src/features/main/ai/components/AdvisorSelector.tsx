"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { MessageSquare, FileText, BarChart2, ClipboardList, FileSpreadsheet } from 'lucide-react'

import { useTranslations } from 'next-intl'

const advisors = [
  { id: 'all', icon: '/icons/crown.svg', label: 'All', desc: 'Comprehensive overview of all areas' },
  { id: 'financial', icon: '/icons/financial-icon.svg', label: 'Financial', desc: 'Deep dive into financial metrics' },
  { id: 'legal', icon: '/icons/legal-icon.svg', label: 'Legal', desc: 'Audit regulatory requirements' },
  { id: 'marketing', icon: '/icons/marketing-icon.svg', label: 'Marketing', desc: 'Review customer acquisition' },
  { id: 'revenue', icon: '/icons/financial-icon.svg', label: 'Revenue', desc: 'Break down monetization pathways' },
  { id: 'technical', icon: '/icons/technical-icon.svg', label: 'Technical', desc: 'Examine stack and architectures' },
]

const menuItems = [
  { 
    id: 'chat', 
    title: 'Chat', 
    desc: 'Interact in real-time with our AI advisors to brainstorm concepts.', 
    icon: MessageSquare 
  },
  { 
    id: 'report', 
    title: 'Report', 
    desc: 'Generate detailed business blueprints and architectural drafts.', 
    icon: FileText,
    subItems: advisors
  },
  { 
    id: 'analysis', 
    title: 'Analysis', 
    desc: 'Deep dive into feasibility metrics and resource scaling forecasts.', 
    icon: BarChart2 
  },
  { 
    id: 'summary', 
    title: 'Summary', 
    desc: 'High-level executive breakdown of project objectives.', 
    icon: ClipboardList 
  },
  { 
    id: 'classification', 
    title: 'Classification', 
    desc: 'Categorize sector alignment and industry standards.', 
    icon: FileSpreadsheet 
  }
]

interface AdvisorSelectorProps {
  activeTankId: string
}

export default function AdvisorSelector() {
  const t = useTranslations('Dashboard.Advisors')

  return (
    <div className="flex flex-col gap-[13.8px] bg-white/80 w-64 backdrop-blur-sm p-4 rounded-[32px] border border-border shadow-sm overflow-y-auto overflow-x-hidden thin-scrollbar h-fit max-h-[calc(100vh-200px)]">
      <div className="px-2 pb-2 mb-2 border-b border-border/50">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {t('title_council')}
        </h3>
        <p className="text-[10px] text-muted-foreground font-medium">
          {t('description')}
        </p>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon

        return (
          <div key={item.id} className="flex flex-col gap-2 w-full group">
            <Button
              className="w-full h-auto py-2.5 px-3.5 justify-start rounded-2xl flex items-start gap-3 transition-all duration-300 text-secondary-foreground hover:bg-secondary/10 hover:text-primary"
              variant="ghost"
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" />
              <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                <span className="text-xs font-bold truncate w-full">{item.title}</span>
                <span className="text-[9px] text-muted-foreground font-normal leading-tight mt-0.5 whitespace-normal wrap-break-word w-full">
                  {item.desc}
                </span>
              </div>
            </Button>

            {item.id === 'report' && item.subItems && (
              <div className="pl-4 flex flex-col gap-1 py-1 border-l border-dashed border-zinc-200/80 ml-5 mt-0.5">
                {item.subItems.map((sub) => {
                  return (
                    <div
                      key={sub.id}
                      className="w-full h-auto py-1.5 px-2 justify-start rounded-xl flex items-center gap-2.5 transition-all duration-200 text-left text-zinc-600 hover:bg-secondary/10 hover:text-primary cursor-pointer"
                    >
                      <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                        <Image 
                          src={sub.icon} 
                          alt={sub.label} 
                          width={16} 
                          height={16} 
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col items-start text-left min-w-0">
                        <span className="text-[10px] font-bold leading-tight">{sub.label}</span>
                        <span className="text-[9px] text-muted-foreground font-normal leading-tight mt-0.5 wrap-break-word">
                          {sub.desc}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
