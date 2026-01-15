"use client"

import { PanelLeft } from "lucide-react"
import LogoComponent from "@/components/shared/LogoComponent"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarHeaderProps {
  onClose: () => void
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="flex p-5 items-center justify-between">
      <LogoComponent 
        textClassName="text-[24px] font-bold! leading-[1.1] font-sans cursor-pointer" 
        imageClassName="w-6! h-6! cursor-pointer"
      />
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 bg-secondary hover:bg-secondary/70 rounded-lg text-forground cursor-pointer"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="bg-secondary text-foreground border-none rounded-lg px-3 py-1.5 font-bold z-110"
          >
            <p>Close sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
