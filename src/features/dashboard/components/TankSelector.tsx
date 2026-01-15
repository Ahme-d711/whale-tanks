"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function TankSelector() {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-[24px] border border-[#E2E8F0] shadow-sm">
      <Button variant="ghost" className="h-10 px-4 gap-2 bg-[#F1F5F9] text-[#1A2B4B] rounded-full font-medium">
        <Image src="/startup-logo.svg" alt="" width={18} height={18} />
        Startup Tank
      </Button>
      <Button variant="ghost" className="h-10 px-4 gap-2 text-[#64748B] hover:bg-white/50 rounded-full font-medium">
        <Image src="/tech-logo.svg" alt="" width={18} height={18} />
        Tech Tank
      </Button>
      <Button variant="ghost" className="h-10 px-4 gap-2 text-[#64748B] hover:bg-white/50 rounded-full font-medium">
        <Image src="/logo.svg" alt="" width={18} height={18} />
        Investor Tank
      </Button>
    </div>
  )
}
