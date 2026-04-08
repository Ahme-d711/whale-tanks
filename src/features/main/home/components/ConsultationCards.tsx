"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

export const ConsultationCards = () => {
    const t = useTranslations('HomePage.Advisors')

    const advisors = [
        { icon: '/icons/legal-icon.svg', key: 'legal' },
        { icon: '/icons/psychological-icon.svg', key: 'psychological' },
        { icon: '/icons/financial-icon.svg', key: 'financial' },
        { icon: '/icons/marketing-icon.svg', key: 'marketing' },
        { icon: '/icons/technical-icon.svg', key: 'technical' },
    ]

    return (
        <section className="relative z-10 w-full overflow-hidden py-4">
            <div className="flex gap-2 md:gap-3 px-4 lg:px-0 overflow-x-auto overflow-y-hidden no-scrollbar pb-4 md:justify-center">
                {advisors.map((advisor, index) => (
                    <motion.div
                        key={advisor.key}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-center gap-1.5 md:gap-2 bg-white backdrop-blur-md border hover:bg-[#FAFBFF] hover:border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[16px] md:rounded-[20px] px-2 py-3 md:py-4 w-fit min-w-[140px] md:max-w-[195px] shrink-0"
                    >
                        <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shrink-0">
                            <Image 
                                src={advisor.icon} 
                                alt={t(advisor.key as any)} 
                                width={32} 
                                height={32} 
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-foreground font-semibold text-sm md:text-lg leading-tight line-clamp-1">
                                {t('consultation', { count: 383 })}
                            </span>
                            <span className="text-muted-foreground text-[10px] md:text-xs">
                                {t(advisor.key as any)}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
