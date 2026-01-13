"use client"

import { motion } from "motion/react"
import LoginForm from '../components/LoginForm'
import { Card, CardContent } from '@/components/ui/card'
import { AuthBackground } from '../components/AuthBackground'
import { AuthHeader } from '../components/AuthHeader'
import { AnimatedTitle } from '../components/AnimatedTitle'
import { CoreGlow } from '../components/CoreGlow'

export default function LoginTemplate() {
  return (
    <main 
      className="min-h-screen w-full relative bg-blue-50/50 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute -inset-10 pointer-events-none">
        <AuthBackground />
      </div>

      {/* Branded Header */}
      <AuthHeader />

      {/* Floating Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 25, 
          delay: 0.2,
        }}
        className="w-full max-w-md px-4 z-20 relative perspective-[1000px] opacity-0"
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
