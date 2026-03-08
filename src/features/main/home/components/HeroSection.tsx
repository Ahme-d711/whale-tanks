"use client"
import React from 'react'
import { motion } from "motion/react"

import { useTranslations } from 'next-intl'

export const HeroSection = () => {
    const t = useTranslations('HomePage.Hero')
    
    return (
        <section className="relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-8 px-4">
            {/* <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-[50px] leading-[120%] tracking-[0.18em] font-bold max-w-[800px] text-center text-foreground mx-auto mb-4"
            >
                {t('title')}
            </motion.h1> */}
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl md:text-[34px] text-foreground font-bold font-roboto-flex leading-[1.1] tracking-widest uppercase"
            >
                {t('subtitle')}
            </motion.p>
        </section>
    )
}
