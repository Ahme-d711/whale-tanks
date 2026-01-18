"use client"

import React from 'react'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function MobileSidebarTrigger() {
  return (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-background border-primary/20 shadow-lg rounded-2xl hover:bg-background active:scale-95 transition-all"
      >
        <Menu className="w-6 h-6 text-primary cursor-pointer" />
      </Button>
    </div>
  )
}
