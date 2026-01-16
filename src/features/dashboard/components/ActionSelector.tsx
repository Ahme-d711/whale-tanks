"use client"

import React from 'react'
import { Sparkles, Layout } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ActionSelector() {
  const [activeAction, setActiveAction] = React.useState<'consultation' | 'web_builder'>('consultation')
  const [activeSubAction, setActiveSubAction] = React.useState<'code' | 'view' | 'database'>('code')

  const mainActions = [
    { 
      id: 'consultation', 
      label: 'Consultation', 
      icon: Sparkles 
    },
    { 
      id: 'web_builder', 
      label: 'Web Builder', 
      icon: Layout 
    }
  ] as const;

  const subActions = [
    { id: 'code', label: 'Code' },
    { id: 'view', label: 'View' },
    { id: 'database', label: 'Database' }
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Actions */}
      <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-[32px] border border-border shadow-sm w-fit">
        {mainActions.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          return (
            <Button
              key={action.id}
              variant="ghost"
              onClick={() => setActiveAction(action.id)}
              className={`h-9 px-4 gap-2 rounded-full font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-secondary text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {action.id === 'web_builder' ? (
                <div className={`p-1 rounded-md transition-colors ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {action.label}
            </Button>
          );
        })}
      </div>

      {/* Web Builder Sub-actions */}
      {activeAction === 'web_builder' && (
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-[32px] border border-border shadow-sm w-fit animate-in fade-in slide-in-from-top-2 duration-300">
          {subActions.map((sub) => (
            <Button
              key={sub.id}
              variant="ghost"
              onClick={() => setActiveSubAction(sub.id)}
              className={`h-8 px-4 rounded-full font-bold capitalize transition-all duration-300 cursor-pointer ${
                activeSubAction === sub.id
                  ? "bg-secondary text-primary shadow-sm text-sm"
                  : "text-muted-foreground hover:bg-secondary/50 text-sm"
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
