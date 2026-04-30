"use client"

import React from 'react'
import SidebarMenu from '@/components/SidebarMenu'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import DashboardGrid from '../components/DashboardGrid'
import MobileNavbar from '../components/MobileNavbar'

import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'

export default function DashboardTemplate() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [activeTankId, setActiveTankId] = React.useState('startup')
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'chat' | 'builder'>('chat')
  
  const analyzer = useIdeaAnalyzer((data) => {
    console.log("Chat Response Received:", data)
  })

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Sidebar Component */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        isPersistent={true}
        trigger={<></>}
      />

      {/* Mobile Navbar */}
      <MobileNavbar 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        onNewChat={() => analyzer.resetSession()} 
        onDeleteChat={() => setShowDeleteDialog(true)} 
        currentView={activeTab}
        onToggleView={() => setActiveTab(prev => prev === 'chat' ? 'builder' : 'chat')}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="حذف المحادثة"
        description="هل أنت متأكد أنك تريد حذف سجل المحادثة الحالي؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() => {
          analyzer.resetSession();
          setShowDeleteDialog(false);
        }}
        confirmLabel="تأكيد الحذف"
        cancelLabel="إلغاء"
        variant="destructive"
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative px-0 mt-14 md:mt-0 md:px-4">
        
        {/* Workspace Grid */}
        <DashboardGrid 
          activeTankId={activeTankId} 
          onTankChange={setActiveTankId} 
          analyzer={analyzer} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </main>
    </div>
  )
}

