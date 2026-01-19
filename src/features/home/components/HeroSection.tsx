"use client"
import React from 'react'
import { motion } from "motion/react"

import { useTranslations } from 'next-intl'

export const HeroSection = () => {
    const t = useTranslations('HomePage.Hero')
    
    return (
        <section className="relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-8 px-4">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-[50px] leading-[120%] tracking-[0.18em] font-bold max-w-[800px] text-center text-foreground mx-auto mb-4"
            >
                {t('title')}
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm md:text-lg text-secondary-foreground font-medium tracking-[0.2em] uppercase"
            >
                {t('subtitle')}
            </motion.p>
        </section>
    )
}
