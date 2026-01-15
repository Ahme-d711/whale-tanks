"use client"

import { MessageSquarePlus, Search, X } from "lucide-react"
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
  return (
    <>
      {/* Trigger */}
      <div onClick={() => onOpenChange(!isOpen)}>
        {trigger}
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-80 bg-background z-100 shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo and Close Button */}
          <div className="p-6 border-b flex items-center justify-between">
            <LogoComponent />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* New Chat Button */}
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-12 text-base font-medium hover:bg-secondary"
            >
              <MessageSquarePlus className="w-5 h-5" />
              New Chat
            </Button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search about Chats" 
                className="pl-10 h-12 rounded-lg"
              />
            </div>

            {/* Last Chats Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Last Chats</h3>
              {/* Empty state for now */}
              <div className="text-center py-8 text-sm text-muted-foreground">
                No chats yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
