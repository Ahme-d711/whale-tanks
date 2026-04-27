"use client"

import { useTranslations } from 'next-intl'
import { SquarePen, Search } from "lucide-react"
import { useRouter } from '@/i18n/routing'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'

interface SidebarActionsProps {
  isCollapsed?: boolean
}

export default function SidebarActions({ isCollapsed }: SidebarActionsProps) {
  const t = useTranslations('Sidebar')
  const analyzer = useIdeaAnalyzer()
  const router = useRouter()

  const actions = [
    { 
      icon: SquarePen, 
      label: t('new_chat'), 
      id: 'new_chat', 
      onClick: () => {
        analyzer.resetSession()
        router.push('/ai')
      } 
    },
    { icon: Search, label: t('search'), id: 'search' },
  ]

  return (
    <div className={`space-y-3 overflow-y-auto px-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
      <TooltipProvider>
        {actions.map((action) => (
          <Tooltip key={action.id} delayDuration={isCollapsed ? 0 : 1000000}>
            <TooltipTrigger asChild>
              <button 
                onClick={action.onClick}
                className={`w-full flex items-center gap-2 cursor-pointer hover:bg-secondary transition-colors rounded-xl ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-3 py-2'}`}
              >
                <div className="flex items-center justify-center text-foreground shrink-0">
                  <action.icon className="w-6 h-6" />
                </div>
                {!isCollapsed && <span className="text-base text-foreground truncate text-start">{action.label}</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-secondary text-foreground border-none rounded-lg px-3 py-1.5 font-bold">
                <p>{action.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
