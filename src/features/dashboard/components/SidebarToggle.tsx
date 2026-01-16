"use client"

import React from 'react'
import { PanelLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export default function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  if (isOpen) return null

  return (
    <div className="absolute top-6 left-6 z-50 hidden md:block">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onToggle}
        className="bg-white border-primary/20 shadow-lg rounded-2xl cursor-pointer hover:bg-white active:scale-95 transition-all group w-10 h-10"
      >
        <PanelLeft className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
      </Button>
    </div>
  )
}
