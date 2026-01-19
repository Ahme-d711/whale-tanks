"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

interface AnimatedBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  duration?: number
  borderWidth?: number | string
}

export default function AnimatedBorder({
  children,
  className,
  containerClassName,
  duration = 3,
  borderWidth = 2
}: AnimatedBorderProps) {
  return (
    <div className={cn("relative group overflow-hidden isolation-auto bg-background", containerClassName)}>
        {/* Rotating Border Gradient */}
        <motion.div 
            className="absolute -inset-[50%] z-0"
             style={{
                background: `conic-gradient(from 0deg, transparent 0 60deg, #3b82f6 90deg, transparent 120deg 360deg)`,
             }}
            animate={{
                rotate: 360,
            }}
            transition={{
                rotate: {
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                }
            }}
        />
        
        {/* Inner Content Block masking the middle */}
        <div 
            className={cn("relative z-10 bg-background h-full w-full", className)}
            style={{ 
                margin: borderWidth, // Simulates border width
                width: `calc(100% - ${Number(borderWidth) * 2}px)`,
                height: `calc(100% - ${Number(borderWidth) * 2}px)`
            }}
        >
            {children}
        </div>
    </div>
  )
}
