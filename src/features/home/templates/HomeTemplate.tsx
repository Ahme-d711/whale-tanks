import { HeroSection } from '../components/HeroSection'
import { ServiceCards } from '../components/ServiceCards'
import { IdeaAnalyzer } from '../components/IdeaAnalyzer'
import { ConsultationCards } from '../components/ConsultationCards'

export default function HomeTemplate() {
  return (
    <main className="flex-1 w-full relative overflow-hidden flex flex-col">
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-8 md:gap-8 pt-4 pb-6 w-full max-w-5xl mx-auto">
        <HeroSection />
        <ServiceCards />
        <IdeaAnalyzer />
        <ConsultationCards />
      </div>
    </main>
  )
}
