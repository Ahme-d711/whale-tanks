"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

interface TankSelectorProps {
  activeTankId: string
  onTankChange: (id: string) => void
}

export default function TankSelector({ activeTankId, onTankChange }: TankSelectorProps) {
  const tanks = [
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

  return (
    <div className="flex items-center gap-1 bg-white backdrop-blur-sm p-1 rounded-[32px] border border-border shadow-sm">
      {tanks.map((tank) => (
        <Button
          key={tank.id}
          variant="ghost"
          onClick={() => onTankChange(tank.id)}
          className={`h-auto px-4 py-1 gap-4 rounded-[24px] cursor-pointer transition-all duration-300 flex items-center hover:bg-transparent ${
            activeTankId === tank.id
              ? "bg-secondary shadow-sm"
              : "hover:bg-border"
          }`}
        >
          <div className="relative w-8 h-8 shrink-0">
            <Image 
              src={tank.icon} 
              alt={tank.name} 
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-bold tracking-tight text-foreground">
              {tank.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {tank.subtitle}
            </span>
          </div>
        </Button>
      ))}
    </div>
  )
}
