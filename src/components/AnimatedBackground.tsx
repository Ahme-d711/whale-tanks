"use client"

import React from 'react'
import { motion } from "motion/react"

const BackgroundGradient = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
          x: [-100, 100, -100],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-40"
        style={{
          background: `radial-gradient(circle at center, #60A5FA 0%, transparent 50%),
                       radial-gradient(circle at 20% 30%, #3B82F6 0%, transparent 40%),
                       radial-gradient(circle at 80% 70%, #2260FF 0%, transparent 40%)`,
          filter: "blur(80px)",
        }}
      />
    </div>
  )
}


const NeuralGrid = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
      <svg width="100%" height="100%">
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => {
          // Dots positioning (0-100%)
          const dotX = ((i * 137) % 100)
          const dotY = ((i * 223) % 100)
          
          return (
             <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary rounded-full blur-[1px]"
              style={{
                left: `${dotX}%`,
                top: `${dotY}%`,
              }}
              animate={{
                scale: [1, 1.2, 1], 
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

const DataStreams = () => {
  const [mounted, setMounted] = React.useState(false)
  const streams = React.useMemo(() => {
    return [...Array(6)].map(() => ({
      top: Math.random() * 100 + "%",
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 2,
    }))
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-x-0 top-0 h-full pointer-events-none z-0 overflow-hidden">
      {streams.map((s, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-48 bg-linear-to-r from-transparent via-primary/30 to-transparent"
          initial={{ x: "-50vw" }}
          animate={{ x: "150vw" }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "linear"
          }}
          style={{ top: s.top }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </motion.div>
      ))}
    </div>
  )
}

const Sun = () => {
  return (
    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] pointer-events-none z-0">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 200, 50, 0.4) 0%, rgba(255, 100, 0, 0.1) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 200, 0.3) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  )
}

const SparklingParticles = () => {
  const [mounted, setMounted] = React.useState(false)
  const particles = React.useMemo(() => {
    return [...Array(15)].map(() => ({
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }))
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-x-0 bottom-0 h-[60vh] pointer-events-none z-10 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: p.x, 
            y: p.y, 
            scale: 0,
            opacity: 0 
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8)",
          }}
        />
      ))}
    </div>
  )
}

const RisingTide = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-screen pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: "linear-gradient(to top,#0079C466 , #007BB833 , #0050AC00)"
        }}
      />
    </div>
  )
}

export const AnimatedBackground = () => {
  return (
    <>
      {/* <BackgroundGradient /> */}
      {/* <NeuralGrid /> */}
      <DataStreams />
      <RisingTide />
      {/* <Sun /> */}
      {/* <SparklingParticles /> */}
    </>
  )
}
