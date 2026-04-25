"use client"

import { ServiceCard } from "@/components/shared/ServiceCard"
import { useProjects } from "@/features/dashboard/projects/hooks/useProjects"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { useRouter } from "@/i18n/routing"
import { FolderKanban } from "lucide-react"

export default function ProjectsCards() {
  const { projects, isLoading, isError } = useProjects()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl! mx-auto justify-items-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-full max-w-[390px] h-[300px] rounded-3xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive font-medium">Failed to load projects. Please try again later.</p>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="col-span-full w-full">
        <EmptyState 
          icon={FolderKanban}
          title="No Projects Found"
          description="It looks like you haven't started any projects yet. Let's transform your first idea into a success story!"
          actionLabel="Start Analyzing"
          onAction={() => router.push('/ai')}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl! mx-auto justify-items-center">
      {/* Project Cards */}
      {projects?.map((project, index) => (
        <ServiceCard
          key={project.project_id || index}
          icon="/logo.svg"
          title={project.name || "Untitled Project"}
          subtitle={new Date(project.created_at).toLocaleDateString()}
          features={["View detailed analysis and reports for this project."]}
        />
      ))}
    </div>
  )
}
