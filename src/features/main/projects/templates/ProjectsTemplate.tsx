import ProjectsCards from "../components/ProjectsCards"

export default function ProjectsTemplate() {
  return (
    <div className="w-full container mx-auto min-h-screen max-w-[1440px]! px-4 md:px-12 xl:px-29 space-y-6 py-12 pt-40">
      {/* Header */}
      <h1 className="text-[32px] font-semibold text-foreground">Your Projects</h1>

      {/* Projects Grid */}
      <ProjectsCards />
    </div>
  )
}
