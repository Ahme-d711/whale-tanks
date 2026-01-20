"use client"

import { useTranslations } from 'next-intl'

interface LastChatsSectionProps {
  isCollapsed?: boolean
}

export default function LastChatsSection({ isCollapsed }: LastChatsSectionProps) {
  const t = useTranslations('Sidebar')

  if (isCollapsed) return null // Hide for now in rail view as per typical design, or could show icons

  return (
    <div className="space-y-6 pt-4 px-5">
      <h3 className="text-xl text-secondary-foreground font-medium">{t('last_chats')}</h3>
    </div>
  )
}
