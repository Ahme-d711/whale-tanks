"use client"

import SidebarTemplate from "@/features/sidebar/templates/SidebarTemplate"

interface SidebarMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  isPersistent?: boolean
}

export default function SidebarMenu(props: SidebarMenuProps) {
  return <SidebarTemplate {...props} />
}
