"use client"

import React from 'react'
import { PanelLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface FloatingSidebarTriggerProps {
  isOpen: boolean
  onToggle: () => void
}

export default function FloatingSidebarTrigger({ isOpen, onToggle }: FloatingSidebarTriggerProps) {
  if (isOpen) return null

  return (
    <div className="fixed top-24 left-6 z-40 hidden md:block">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onToggle}
        className="bg-background border-primary/20 shadow-lg rounded-2xl cursor-pointer hover:bg-background active:scale-95 transition-all group w-10 h-10"
      >
        <PanelLeft className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
      </Button>
    </div>
  )
}
