"use client"

import React, { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, Variants } from 'motion/react'
import SidebarHeader from "../components/SidebarHeader"
import SidebarActions from "../components/SidebarActions"
import LastChatsSection from "../components/LastChatsSection"

interface SidebarTemplateProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  isPersistent?: boolean
}

export default function SidebarTemplate({ isOpen, onOpenChange, trigger, isPersistent = false }: SidebarTemplateProps) {
  const [mounted, setMounted] = useState(false)
  const locale = useLocale()
  const isRtl = locale === 'ar'

  const sidebarVariants: Variants = {
    closed: {
      x: isRtl ? "100%" : "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    closed: { opacity: 0, x: isRtl ? 20 : -20 },
    open: { opacity: 1, x: 0 }
  }

  const persistentVariants: Variants = {
    closed: { 
      width: 0,
      opacity: 0,
      transition: { 
        width: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    open: { 
      width: 267,
      opacity: 1,
      transition: { 
        width: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      <motion.div variants={itemVariants}>
        <SidebarHeader onClose={() => onOpenChange(false)} />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <SidebarActions />
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex-1 overflow-y-auto">
        <LastChatsSection />
      </motion.div>
    </div>
  )

  if (!mounted) return (
    <div onClick={() => onOpenChange(!isOpen)}>
      {trigger}
    </div>
  )

  const sidebarContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm ${isPersistent ? 'md:hidden' : ''}`}
          />
          
          {/* Sidebar Drawer */}
          <div className={`fixed inset-0 z-[101] pointer-events-none ${isPersistent ? 'md:hidden' : ''}`}>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className={`absolute inset-y-0 ${isRtl ? 'right-0' : 'left-0'} w-[267px] bg-background ${isRtl ? 'border-l-2' : 'border-r-2'} border-t-2 border-primary ${isRtl ? 'rounded-tl-2xl rounded-bl-2xl' : 'rounded-tr-2xl rounded-br-2xl'} shadow-2xl flex flex-col pointer-events-auto overflow-hidden`}
            >
              {content}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <AnimatePresence mode="wait">
        {isPersistent && isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={persistentVariants}
            className={`hidden md:flex bg-background ${isRtl ? 'border-l-2' : 'border-r-2'} border-primary flex-col h-screen sticky top-0 shrink-0 overflow-hidden z-20`}
          >
            <div className="min-w-[267px] h-full">
              {content}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <div 
        onClick={() => onOpenChange(!isOpen)}
        className={isPersistent ? "md:hidden" : ""}
      >
        {trigger}
      </div>
      {/* Drawer for mobile or non-persistent mode */}
      {createPortal(sidebarContent, document.body)}
    </>
  )
}


