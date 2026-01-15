"use client"

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MessageSquarePlus, Search, Menu, X } from "lucide-react"
import LogoComponent from "./shared/LogoComponent"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
}

export default function SidebarMenu({ isOpen, onOpenChange, trigger }: SidebarMenuProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Force body to be scrollable
    document.body.style.overflow = 'auto'
    document.body.style.pointerEvents = 'auto'
  }, [])

  if (!mounted) return (
    <div onClick={() => onOpenChange(!isOpen)}>
      {trigger}
    </div>
  )

  const sidebarContent = (
    <div className={cn("fixed inset-0 z-101 pointer-events-none", !isOpen && "hidden")}>
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-[255px] bg-background border-r-2 border-t-2 border-primary rounded-tr-2xl rounded-br-2xl shadow-2xl transition-transform duration-300 ease-in-out flex flex-col pointer-events-auto overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-8 flex items-center justify-between">
          <LogoComponent />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-10 w-10 bg-[#F0F2F5] hover:bg-secondary rounded-xl text-[#606573]"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pt-2 space-y-8">
          {/* New Chat */}
          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="w-12 h-12 bg-[#F0F2F5] group-hover:bg-secondary transition-colors rounded-xl flex items-center justify-center text-[#606573]">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <span className="text-xl font-medium text-[#606573]">New Chat</span>
          </div>

          {/* Search Row */}
          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="w-12 h-12 flex items-center justify-center text-[#606573]">
              <Search className="w-8 h-8" />
            </div>
            <span className="text-xl font-medium text-[#606573]">Search about Chats</span>
          </div>

          {/* Last Chats Section */}
          <div className="space-y-6 pt-4">
            <h3 className="text-[32px] font-medium text-[#606573] opacity-80">Last Chats</h3>
            {/* Empty state for now */}
            <div className="text-left text-lg text-muted-foreground/60 py-4">
              No chats yet
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div onClick={() => onOpenChange(!isOpen)}>
        {trigger}
      </div>
      {createPortal(sidebarContent, document.body)}
    </>
  )
}
