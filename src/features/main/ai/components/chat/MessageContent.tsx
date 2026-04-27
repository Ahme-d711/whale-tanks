"use client"

import React from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'

interface MessageContentProps {
  content?: string
  role: string
}

export const MessageContent = React.memo(({ content = "", role }: MessageContentProps) => {
  const safeContent = content || "";
  const isArabic = /[\u0600-\u06FF]/.test(safeContent);
  
  if (role === 'user') return (
    <p dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
      {safeContent}
    </p>
  )

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
      <MarkdownRenderer content={safeContent} isArabic={isArabic} />
    </div>
  )
})

MessageContent.displayName = 'MessageContent'
