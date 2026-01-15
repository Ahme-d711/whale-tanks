import ProjectsCards from "../components/ProjectsCards"

export default function ProjectsTemplate() {
  return (
    <div className="w-full container mx-auto min-h-screen max-w-[1440px]! px-12 py-12 pt-32">
      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground mb-8">Your Projects</h1>

      {/* Projects Grid */}
      <ProjectsCards />
    </div>
  )
}
