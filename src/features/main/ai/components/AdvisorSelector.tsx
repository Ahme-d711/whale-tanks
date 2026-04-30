"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { MessageSquare, FileText, BarChart2, ClipboardList, FileSpreadsheet } from 'lucide-react'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'

export default function AdvisorSelector() {
  const t = useTranslations('Dashboard.Advisors')
  const locale = useLocale()
  const isRtl = locale === 'ar'

  const advisors = [
    { id: 'all', icon: '/icons/crown.svg', label: t('advisor_all_label'), desc: t('advisor_all_desc') },
    { id: 'financial', icon: '/icons/financial-icon.svg', label: t('advisor_financial_label'), desc: t('advisor_financial_desc') },
    { id: 'legal', icon: '/icons/legal-icon.svg', label: t('advisor_legal_label'), desc: t('advisor_legal_desc') },
    { id: 'marketing', icon: '/icons/marketing-icon.svg', label: t('advisor_marketing_label'), desc: t('advisor_marketing_desc') },
    { id: 'revenue', icon: '/icons/financial-icon.svg', label: t('advisor_revenue_label'), desc: t('advisor_revenue_desc') },
    { id: 'technical', icon: '/icons/technical-icon.svg', label: t('advisor_technical_label'), desc: t('advisor_technical_desc') },
  ]

  const menuItems = [
    { 
      id: 'chat', 
      title: t('chat_title'), 
      desc: t('chat_desc'), 
      icon: MessageSquare 
    },
    { 
      id: 'report', 
      title: t('report_title'), 
      desc: t('report_desc'), 
      icon: FileText,
      subItems: advisors
    },
    { 
      id: 'analysis', 
      title: t('analysis_title'), 
      desc: t('analysis_desc'), 
      icon: BarChart2 
    },
    { 
      id: 'summary', 
      title: t('summary_title'), 
      desc: t('summary_desc'), 
      icon: ClipboardList 
    },
    { 
      id: 'classification', 
      title: t('classification_title'), 
      desc: t('classification_desc'), 
      icon: FileSpreadsheet 
    }
  ]

  return (
    <div className="flex flex-col h-full gap-[13.8px] bg-white/80 w-64 backdrop-blur-sm p-4 rounded-[32px] border border-border shadow-sm overflow-y-auto overflow-x-hidden thin-scrollbar max-h-[calc(100vh-200px)]">
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
          <div key={item.id} dir={isRtl ? 'rtl' : 'ltr'} className="flex flex-col gap-2 w-full group">
            <Button
              className="w-full h-auto py-2.5 px-3.5 justify-start rounded-2xl flex items-start gap-3 transition-all duration-300 text-secondary-foreground hover:bg-secondary/10 hover:text-primary"
              variant="ghost"
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" />
              <div  className="flex-1 min-w-0 flex flex-col text-start">
                <span className="text-xs font-bold truncate w-full">{item.title}</span>
                <span className="text-[9px] text-muted-foreground font-normal leading-tight mt-0.5 whitespace-normal wrap-break-word w-full">
                  {item.desc}
                </span>
              </div>
            </Button>

            {item.id === 'report' && item.subItems && (
              <div className={`${isRtl ? 'pr-4 border-r' : 'pl-4 border-l'} flex flex-col gap-1 py-1 border-dashed border-zinc-200/80 ml-5 mt-0.5`}>
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
