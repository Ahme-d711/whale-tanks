"use client"

import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingFeature {
  text: string
  isLocked?: boolean
}

interface PricingCardProps {
  title: string
  duration: string
  price: string
  saveText?: string
  monthlyPrice?: string
  features: PricingFeature[]
  isPopular?: boolean
}

export default function PricingCard({
  title,
  duration,
  price,
  saveText,
  monthlyPrice,
  features,
}: PricingCardProps) {
  return (
    <div className="flex flex-col h-full bg-background rounded-2xl overflow-hidden border border-border shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Top Section */}
      <div className="bg-primary p-8 pb-14 text-center text-white relative">
        <h3 className="text-3xl font-medium font-poppins">{title}</h3>
        <p className="text-lg font-medium opacity-90 font-poppins">{duration}</p>
      </div>

      {/* Price Badge */}
      <div className="relative -mt-12 flex justify-center mb-6">
        <div className="w-35 h-35 rounded-full bg-primary border-5 border-background shadow-2xl flex flex-col items-center justify-center text-white">
          {saveText && (
            <span className="text-base font-medium text-white px-2 py-0.5 rounded-full font-poppins">
              {saveText}
            </span>
          )}
          <span className="text-5xl font-bold font-poppins">{price}</span>
          {monthlyPrice && (
            <span className="text-sm font-medium opacity-80 font-poppins">
              {monthlyPrice} /Month
            </span>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="flex-1">
        {features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-4 px-6 py-2.5 text-sm transition-colors",
              index % 2 === 0 ? "bg-secondary-foreground/5" : "bg-transparent"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
              feature.isLocked ? "text-muted-foreground" : "bg-emerald-600 text-white"
            )}>
              {feature.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Check className="w-4 h-4" />}
            </div>
            <span className={cn(
              "font-medium",
              feature.isLocked ? "text-muted-foreground" : "text-foreground"
            )}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="p-8">
        <button className="w-full py-3.5 px-6 rounded-2xl border-2 border-primary cursor-pointer text-primary font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300">
          Select this plan
        </button>
      </div>
    </div>
  )
}
