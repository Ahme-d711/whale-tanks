import { HeroSection } from '../components/HeroSection'
import { ServiceCards } from '../components/ServiceCards'
import { IdeaAnalyzer } from '../components/IdeaAnalyzer'

export default function HomeTemplate() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 mt-12">
        <HeroSection />
        <ServiceCards />
        <IdeaAnalyzer />
      </div>
    </main>
  )
}
