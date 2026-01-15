"use client"
import React from 'react'
import { motion } from "motion/react"

export const HeroSection = () => {
    return (
        <section className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-20 px-4">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[64px] leading-[127%] tracking-[0.18em] font-bold max-w-4xl text-center text-foreground mx-auto mb-8"
            >
                The Brain Behind Every Great Business
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl text-secondary-foreground font-medium tracking-[0.2em] uppercase"
            >
                From Idea to Execution
            </motion.p>
        </section>
    )
}
