"use client"

import React from 'react'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import SidebarMenu from '@/components/SidebarMenu'
import SidebarToggle from '../components/SidebarToggle'
import DashboardHeader from '../components/DashboardHeader'
import DashboardGrid from '../components/DashboardGrid'

export default function DashboardTemplate() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  
  return (
    <div className="flex h-screen w-full bg-[#F0F5FF] overflow-hidden font-sans">
      {/* Sidebar Component */}
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        isPersistent={true}
        trigger={
          <div className="fixed top-4 left-4 z-50 md:hidden">
            <Button variant="outline" size="icon" className="bg-white border-primary/20 shadow-lg rounded-2xl hover:bg-white active:scale-95 transition-all">
              <Menu className="w-6 h-6 text-primary cursor-pointer" />
            </Button>
          </div>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {/* Floating Toggle for Desktop */}
        <SidebarToggle 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(true)} 
        />
        
        {/* Header Section */}
        <DashboardHeader />

        {/* Workspace Grid */}
        <DashboardGrid />
      </main>
    </div>
  )
}

