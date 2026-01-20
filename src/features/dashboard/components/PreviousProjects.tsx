"use client"

import React from 'react'
import { FolderKanban, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function PreviousProjects() {
  const t = useTranslations('Dashboard.Projects')

  // Mock projects for now
  const projects = [
    { id: 1, name: 'EcoConnect', date: '2 days ago' },
    { id: 2, name: 'SmartRetail', date: '1 week ago' },
    { id: 3, name: 'SmartRetail', date: '1 week ago' },
    { id: 4, name: 'SmartRetail', date: '1 week ago' },
  ]

  return (
    <div className="flex flex-col gap-3 bg-white/80 w-64 backdrop-blur-sm p-4 rounded-[32px] border border-border shadow-sm">
      <div className="flex items-center justify-between px-2 mb-1">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {t('title')}
        </h3>
        <FolderKanban className="w-4 h-4 text-primary/60" />
      </div>

      <div className="flex flex-col gap-2">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Button
              key={project.id}
              variant="ghost"
              className="w-full cursor-pointer justify-start h-auto py-2.5 px-3 rounded-2xl hover:bg-secondary/50 group transition-all duration-300"
            >
              <div className="flex flex-col items-start gap-0.5 overflow-hidden w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold truncate text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {project.date}
                </span>
              </div>
            </Button>
          ))
        ) : (
          <div className="py-8 flex flex-col items-center justify-center gap-2 opacity-40">
            <FolderKanban className="w-8 h-8" />
            <span className="text-[10px] font-bold uppercase tracking-tighter italic">
              {t('no_projects')}
            </span>
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <Link href="/dashboard/projects" className="w-full text-center">
            <Button 
            variant="link" 
            className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-primary/60 hover:text-primary h-auto p-0 mt-1 no-underline hover:no-underline"
            >
            {t('view_all')}
            </Button>
        </Link>
      )}
    </div>
  )
}
