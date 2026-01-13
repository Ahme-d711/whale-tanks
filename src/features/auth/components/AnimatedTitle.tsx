"use client"

import React from 'react'
import { motion } from "motion/react"

interface AnimatedTitleProps {
  text: string
  className?: string
  delay?: number
}

export const AnimatedTitle = ({ text, className = "", delay = 0.5 }: AnimatedTitleProps) => {
  const letters = text.split("")

  return (
    <div className={`flex justify-center ${className}`}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ 
            opacity: 0, 
            y: i % 2 === 0 ? -30 : 30,
            x: i < letters.length / 2 ? -20 : 20,
            scale: 0.5,
            rotate: i % 2 === 0 ? -15 : 15
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            x: 0, 
            scale: 1,
            rotate: 0 
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 12,
            delay: delay + i * 0.05 
          }}
          className={`${char === " " ? "mr-2" : ""}`}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}
