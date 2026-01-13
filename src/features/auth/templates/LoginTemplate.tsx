"use client"

import React from 'react'
import { motion, useMotionValue, useTransform } from "motion/react"
import LoginForm from '../components/LoginForm'
import { Card, CardContent } from '@/components/ui/card'
import { AuthBackground } from '../components/AuthBackground'
import { AuthHeader } from '../components/AuthHeader'
import { AnimatedTitle } from '../components/AnimatedTitle'
import { CoreGlow } from '../components/CoreGlow' // Moved CoreGlow to its own component

export default function LoginTemplate() {
  // Use MotionValues for performance (no re-renders)
  const mouseX = useMotionValue(50) // 0-100%
  const mouseY = useMotionValue(50) // 0-100%

  // Derived tilt values for the card
  // Mapping 0-100% to tilt range
  const rotateX = useTransform(mouseY, [0, 100], [3, -3])
  const rotateY = useTransform(mouseX, [0, 100], [-3, 3])
  
  // Parallax background movement
  const bgX = useTransform(mouseX, [0, 100], [-20, 20])
  const bgY = useTransform(mouseY, [0, 100], [-20, 20])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { width, height } = currentTarget.getBoundingClientRect()
    
    // Calculate percentage position (0-100)
    const xPct = (clientX / width) * 100
    const yPct = (clientY / height) * 100
    
    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full relative bg-background flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background decoration with Parallax */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute -inset-10 pointer-events-none"
      >
        <AuthBackground mouseX={mouseX} mouseY={mouseY} />
      </motion.div>

      {/* Branded Header */}
      <AuthHeader />

      {/* Floating Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        style={{ 
          rotateX,
          rotateY,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 25, 
          delay: 0.2,
          rotateX: { type: "spring", stiffness: 50, damping: 15 },
          rotateY: { type: "spring", stiffness: 50, damping: 15 }
        }}
        className="w-full max-w-md px-4 z-20 relative perspective-[1000px]"
      >
        <CoreGlow />
        <Card className="border-none shadow-[0_40px_80px_rgba(34,96,255,0.12)] rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <CardContent className="pt-12 pb-14 px-10">
            <div className="text-center mb-12">
              <AnimatedTitle 
                text="Welcome Back" 
                className="text-primary text-4xl font-bold mb-4 tracking-tight"
                delay={0.6}
              />
              <motion.p 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-secondary-foreground font-medium text-lg"
              >
                Enter your details to sign in
              </motion.p>
            </div>

            <LoginForm />
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Copyright */}
      <div className="absolute bottom-8 z-10">
        <p className="text-primary/40 text-sm tracking-widest uppercase font-bold">© 2026 Whale Tanks</p>
      </div>
    </main>
  )
}
