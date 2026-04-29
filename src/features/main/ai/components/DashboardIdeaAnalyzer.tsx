"use client"

import { IdeaAnalyzer } from '@/features/main/home/components/IdeaAnalyzer'
import { useIdeaAnalyzer } from '@/hooks/useIdeaAnalyzer'

interface DashboardIdeaAnalyzerProps {
  analyzer: ReturnType<typeof useIdeaAnalyzer>
}

export default function DashboardIdeaAnalyzer({ analyzer }: DashboardIdeaAnalyzerProps) {
  return <IdeaAnalyzer variant="dashboard" analyzer={analyzer} />
}
