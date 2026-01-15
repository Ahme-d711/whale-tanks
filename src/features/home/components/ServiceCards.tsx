"use client"

import { ServiceCard } from '@/components/shared/ServiceCard'

export const ServiceCards = () => {
  const services = [
    {
      icon: '/startup-logo.svg',
      title: 'Startup Tank',
      subtitle: 'White Whale',
      description: 'Where ideas take shape.',
      features: [
        "Step into a simulated boardroom with AI-powered virtual advisors and experience deep brainstorming, idea validation, and strategic thinking.",
        "You’ll gain clarity on your vision, market positioning, value proposition, and the real potential of your idea before moving forward."
      ],
    },
    {
      icon: '/tech-logo.svg',
      title: 'Tech Tank',
      subtitle: 'Black Whale',
      description: 'Where ideas become real products.',
      features: [
        'Initialize Idea',
        'Analyze & Validate',
        'Design UI / UX',
        'Build with AI + No-Code',
        'Structure for Scale',
        'Deploy Product'
      ],
    },
    {
      icon: '/logo.svg',
      title: 'Investor Tank',
      subtitle: 'Blue Whale',
      description: 'Where ideas face investors.',
      features: [
        "Step into a project inside a realistic investor environment and experience how decision-makers think.",
        "Receive strategic, financial, and market feedback from an intimate board of view, helping you refine your story and prepare for real opportunities."
      ],
    }
  ]

  return (
    <section className="relative z-10 px-4 pb-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  )
}
