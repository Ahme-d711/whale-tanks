"use client"

import React from 'react'
import { Sparkles, Layout } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ActionSelector() {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 w-fit rounded-[24px] border border-[#E2E8F0] shadow-sm">
      <Button variant="ghost" className="h-9 px-4 gap-2 bg-[#F1F5F9] text-[#2260FF] rounded-full font-bold">
        <Sparkles className="w-4 h-4" />
        Consultation
      </Button>
      <Button variant="ghost" className="h-9 px-4 gap-2 text-[#64748B] hover:bg-white/50 rounded-full font-medium">
        <Layout className="w-4 h-4" />
        Web Builder
      </Button>
    </div>
  )
}
