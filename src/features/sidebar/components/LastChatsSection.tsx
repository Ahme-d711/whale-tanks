"use client"

import { useTranslations } from 'next-intl'

export default function LastChatsSection() {
  const t = useTranslations('Sidebar')

  return (
    <div className="space-y-6 pt-4 px-5">
      <h3 className="text-xl text-secondary-foreground font-medium">{t('last_chats')}</h3>
    </div>
  )
}
