"use client"

import React from 'react'
import { Sparkles, Layout } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"

export type SubActionId = 'code' | 'view' | 'database';

interface ActionSelectorProps {
  activeAction: 'consultation' | 'web_builder'
  setActiveAction: (action: 'consultation' | 'web_builder') => void
  activeSubAction: SubActionId
  setActiveSubAction: (action: SubActionId) => void
  canView?: boolean
}

export default function ActionSelector({
  activeAction,
  setActiveAction,
  activeSubAction,
  setActiveSubAction,
  canView = true
}: ActionSelectorProps) {
  const t = useTranslations('WebBuilder')

  const mainActions = [
    { 
      id: 'consultation', 
      label: t('consultation'), 
      icon: Sparkles 
    },
    { 
      id: 'web_builder', 
      label: t('web_builder'), 
      icon: Layout 
    }
  ] as const;

  // Build sub-actions array based on renderability
  const subActions: { id: SubActionId, label: string }[] = [
    { id: 'code', label: t('code') },
    ...(canView ? [{ id: 'view' as SubActionId, label: t('view') }] : []),
    { id: 'database', label: t('database') }
  ];

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {/* Main Actions */}
      <div className="flex items-center gap-0.5 md:gap-1 bg-white/80 backdrop-blur-sm p-0.5 md:p-1 rounded-[32px] border border-border shadow-sm w-fit overflow-x-auto overflow-y-hidden no-scrollbar">
        {mainActions.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          return (
            <Button
              key={action.id}
              variant="ghost"
              onClick={() => setActiveAction(action.id)}
              className={`h-7 md:h-9 px-3 md:px-4 gap-1.5 md:gap-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-secondary text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {action.id === 'web_builder' ? (
                <div className={`p-0.5 md:p-1 rounded-md transition-colors ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Icon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              ) : (
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              )}
              {action.label}
            </Button>
          );
        })}
      </div>

      {/* Web Builder Sub-actions */}
      {activeAction === 'web_builder' && (
        <div className="flex items-center gap-0.5 md:gap-1 bg-white/80 backdrop-blur-sm p-0.5 md:p-1 rounded-[32px] border border-border shadow-sm w-fit animate-in fade-in slide-in-from-top-2 duration-300">
          {subActions.map((sub) => (
            <Button
              key={sub.id}
              variant="ghost"
              onClick={() => setActiveSubAction(sub.id)}
              className={`h-7 md:h-8 px-3 md:px-4 rounded-full font-bold capitalize transition-all duration-300 cursor-pointer text-[11px] md:text-sm ${
                activeSubAction === sub.id
                  ? "bg-secondary text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {sub.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
