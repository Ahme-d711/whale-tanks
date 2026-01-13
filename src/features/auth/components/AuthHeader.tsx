"use client"

import { motion } from "motion/react"

import Image from 'next/image'

export const AuthHeader = () => {
  const brandName = "Whale Tanks"
  const letters = brandName.split("")

  return (
    <div className="absolute top-12 flex flex-col items-center gap-4 z-10">
      <motion.div className="flex items-center gap-4 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none flex items-center justify-center">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: [1, 1.8], 
                opacity: [0, 0.3, 0] 
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
              className="absolute w-[120%] h-[150%] border border-primary/10 rounded-full blur-sm"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="w-12 h-12">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <Image 
                src="/logo.svg" 
                alt="Whale Tanks Logo" 
                fill
                className="object-contain"
              />
            </motion.div>
          </div>

          <div className="flex">
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
                  delay: 0.5 + i * 0.05 
                }}
                className={`text-primary text-4xl font-black tracking-tight ${char === " " ? "mr-2" : ""}`}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
