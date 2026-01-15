"use client"

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import SidebarHeader from "../components/SidebarHeader"
import SidebarActions from "../components/SidebarActions"
import LastChatsSection from "../components/LastChatsSection"

interface SidebarTemplateProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
}

const sidebarVariants: Variants = {
  closed: {
    x: "-100%",
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
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0 }
}

export default function SidebarTemplate({ isOpen, onOpenChange, trigger }: SidebarTemplateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'auto'
    document.body.style.pointerEvents = 'auto'
  }, [])

  if (!mounted) return (
    <div onClick={() => onOpenChange(!isOpen)}>
      {trigger}
    </div>
  )

  const sidebarContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-101 pointer-events-none">
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="absolute inset-y-0 left-0 w-[267px] bg-background border-r-2 border-t-2 border-primary rounded-tr-2xl rounded-br-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
          >
            <motion.div variants={itemVariants}>
              <SidebarHeader onClose={() => onOpenChange(false)} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <SidebarActions />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex-1 overflow-y-auto">
              <LastChatsSection />
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div onClick={() => onOpenChange(!isOpen)}>
        {trigger}
      </div>
      {createPortal(sidebarContent, document.body)}
    </>
  )
}
