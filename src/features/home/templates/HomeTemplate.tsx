"use client"
import React from 'react'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { HeroSection } from '../components/HeroSection'
import { ServiceCards } from '../components/ServiceCards'
import { IdeaAnalyzer } from '../components/IdeaAnalyzer'

export default function HomeTemplate() {
  return (
    <main className="min-h-screen w-full relative bg-linear-to-b from-blue-50 via-white to-blue-50/30 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 mt-20">
        <HeroSection />
        <ServiceCards />
        <IdeaAnalyzer />
      </div>
    </main>
  )
}
