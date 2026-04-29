"use client"

import Image from 'next/image'
import { Button } from "@/components/ui/button"

import { usePackages } from "@/features/dashboard/packages/hooks/usePackages"

interface TankSelectorProps {
  activeTankId: string
  onTankChange: (id: string) => void
}

export default function TankSelector({ activeTankId, onTankChange }: TankSelectorProps) {
  const { packages } = usePackages({ active_only: true })

  const hardcodedTanks = [
    { 
      id: 'startup', 
      name: 'Startup Tank', 
      subtitle: 'White Whale',
      icon: '/startup-logo.svg' 
    },
    { 
      id: 'tech', 
      name: 'Tech Tank', 
      subtitle: 'Black Whale',
      icon: '/tech-logo.svg' 
    },
    { 
      id: 'investor', 
      name: 'Investor Tank', 
      subtitle: 'Blue Whale',
      icon: '/logo.svg' 
    },
  ]

  const tanks = packages.length > 0
    ? packages.map((pkg: any) => {
        const matched = hardcodedTanks.find(t => t.subtitle === pkg.name)
        return matched || {
          id: pkg.package_id,
          name: pkg.name,
          subtitle: pkg.name,
          icon: '/logo.svg'
        }
      })
    : hardcodedTanks

  return (
    <div className="flex items-center gap-1 p-1 w-fit">
      {tanks.map((tank) => (
        <div
          key={tank.id}
          className="h-auto px-2 py-1 md:px-4 md:py-2 gap-2 md:gap-4 rounded-[16px] md:rounded-[24px] transition-all duration-300 flex items-center bg-white/50 hover:bg-secondary/10 border border-transparent hover:border-secondary/30 shadow-sm cursor-pointer"
        >
          <div className="relative w-6 h-6 md:w-8 md:h-8 shrink-0">
            <Image 
              src={tank.icon} 
              alt={tank.name} 
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs md:text-base font-bold tracking-tight text-foreground truncate w-full">
              {tank.name}
            </span>
            <span className="text-[8px] md:text-[10px] text-muted-foreground truncate w-full">
              {tank.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
