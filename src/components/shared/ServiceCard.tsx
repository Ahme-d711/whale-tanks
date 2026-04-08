"use client"

import { motion } from "motion/react"
import Image from 'next/image'

export interface ServiceCardProps {
  icon: string
  title: string
  subtitle: string
  description?: string
  features: string[]
}

export const ServiceCard = ({ icon, title, subtitle, description, features }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="backdrop-blur-xl bg-background rounded-[24px] md:rounded-3xl p-4 md:p-6 max-w-[390px] w-full h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 border border-border"
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0">
          <Image src={icon} alt={title} width={40} height={40} className="object-contain w-full h-full" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-2xl font-bold text-foreground leading-tight">{title}</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Blue Description Heading */}
      <h4 className="text-xs md:text-sm font-semibold! text-primary mb-1">
        {description}
      </h4>

      {/* Features as paragraphs */}
      <div className="space-y-0.5 md:space-y-1">
        {features.map((feature, index) => (
          <p key={index} className="text-xs md:text-sm leading-snug font-normal text-secondary-foreground">
            {feature}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
