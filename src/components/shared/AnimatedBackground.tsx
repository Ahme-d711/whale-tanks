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
    <div className="absolute inset-x-0 bottom-0 h-[75vh] pointer-events-none z-0">
      <motion.div
        animate={{
          y: [0, -40, 0],
          scaleY: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-linear-to-t from-[#2260FF] via-[#3B82F6]/50 to-transparent blur-3xl opacity-40 shrink-0"
      />
      
      {/* Animated Waves at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-full">
         <motion.svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 left-0 w-full h-96 opacity-30 fill-[#2260FF]"
            preserveAspectRatio="none"
            animate={{
              x: [-30, 30, -30],
              y: [20, -20, 20],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </motion.svg>
          <motion.svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 left-0 w-full h-128 opacity-20 fill-[#3B82F6]"
            preserveAspectRatio="none"
            animate={{
              x: [30, -30, 30],
              y: [-20, 20, -20],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </motion.svg>
      </div>
    </div>
  )
}

export const AnimatedBackground = () => {
  return (
    <>
      <BackgroundGradient />
      <NeuralGrid />
      <DataStreams />
      <RisingTide />
      <Sun />
      <SparklingParticles />
    </>
  )
}
