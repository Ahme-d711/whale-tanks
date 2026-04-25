"use client"

import React from 'react'
import { motion } from 'motion/react'
import { LucideIcon, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-background/50 backdrop-blur-sm rounded-[32px] border border-dashed border-border/60 min-h-[400px] w-full"
    >
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary/40" />
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="rounded-2xl px-8 h-12 font-bold cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
