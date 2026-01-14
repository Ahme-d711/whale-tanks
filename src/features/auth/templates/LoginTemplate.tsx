"use client"

import { motion } from "motion/react"
import LoginForm from '../components/LoginForm'
import { Card, CardContent } from '@/components/ui/card'
import { AuthBackground } from '../components/AuthBackground'
import { AuthHeader } from '../components/AuthHeader'
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
          <CardContent className="pt-5 pb-8 px-10">
            {/* Branded Header */}
            <AuthHeader cardTitle="Welcome Back" cardBaio="Enter your email and password to sign in"/>
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
