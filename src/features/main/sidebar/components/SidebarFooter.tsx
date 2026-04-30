"use client"

import React, { useState } from 'react'
import { useLocale } from 'next-intl'
import { motion, Variants } from 'motion/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from "@/features/auth/stores/authStore"
import { 
  MoreVertical, 
  LogOut, 
  UserCog, 
  Languages,
  Check
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { usePathname, useRouter } from "@/i18n/routing"
import { EditUserDialog } from "@/features/dashboard/users/components/EditUserDialog"
import { UserDashboard } from "@/features/dashboard/users/types/user.types"
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog"

import { languages } from "@/components/shared/LanguageSelector"

interface SidebarFooterProps {
  isCollapsed: boolean
  variants?: Variants
}

export default function SidebarFooter({ isCollapsed, variants }: SidebarFooterProps) {
  const { user } = useAuthStore()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const router = useRouter()
  const pathname = usePathname()
  const { logout, loading: isLoggingOut } = useLogout()

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <motion.div variants={variants} className="mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`w-full p-3 border-t border-primary/20 bg-primary/5 flex items-center hover:bg-primary/10 transition-colors cursor-pointer outline-none ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} overflow-hidden flex-1`}>
              <Avatar className="w-9 h-9 border-2 border-primary/20 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden text-start">
                  <span className="font-bold text-xs text-foreground truncate">{user?.name || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground truncate leading-tight">{user?.email || ''}</span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="p-1 rounded-md transition-colors">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRtl ? 'start' : 'end'} side="top" className="w-56 mb-2">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer">
            <UserCog className="w-4 h-4 mr-2" />
            <span>{locale === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Languages className="w-4 h-4 mr-2" />
              <span>{locale === 'ar' ? 'تغيير اللغة' : 'Change Language'}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-48 max-h-80 overflow-y-auto thin-scrollbar">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)} 
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {locale === lang.code && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setLogoutDialogOpen(true)} 
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        user={user as unknown as UserDashboard}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title={locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        description={locale === 'ar' ? 'هل أنت متأكد من رغبتك في تسجيل الخروج؟' : 'Are you sure you want to log out?'}
        confirmText={locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        variant="destructive"
        onConfirm={async () => {
          await logout()
          setLogoutDialogOpen(false)
        }}
        isLoading={isLoggingOut}
      />
    </motion.div>
  )
}
