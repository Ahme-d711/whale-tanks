"use client"

import { ServiceCard } from "@/components/shared/ServiceCard"
import AboutInfo from "../components/AboutInfo"

const examples = [
  {
    icon: "/logo.svg",
    title: "Restaurant Project",
    subtitle: "Blue Whale",
    features: [
      "A modern digital platform designed for restaurants to showcase their menu, brand identity, and dining experience through a clean and intuitive interface.",
      "The project focuses on clear menu presentation, smooth navigation, and visually engaging layouts that enhance the customer's journey from discovery to decision."
    ]
  },
  {
    icon: "/logo.svg",
    title: "Clothes Project",
    subtitle: "Black Whale",
    features: [
      "A modern fashion-focused digital platform designed to showcase, manage, and sell clothing products with a seamless user experience.",
      "The project focuses on creating a clean, visually appealing interface that highlights collections, product details, and brand identity while ensuring smooth navigation and fast performance."
    ]
  },
  {
    icon: "/logo.svg",
    title: "Restaurant Project",
    subtitle: "Blue Whale",
    features: [
      "A modern digital platform designed for restaurants to showcase their menu, brand identity, and dining experience through a clean and intuitive interface.",
      "The project focuses on clear menu presentation, smooth navigation, and visually engaging layouts that enhance the customer's journey from discovery to decision."
    ]
  }
]

export default function AboutTemplate() {
  return (
    <div className="w-full container mx-auto min-h-screen max-w-[1440px] px-4 md:px-12 xl:px-29 py-12 pt-40 space-y-6">
      <AboutInfo />

      {/* Examples Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Examples</h2>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-start">
        {examples.map((example, index) => (
          <ServiceCard
            key={index}
            icon={example.icon}
            title={example.title}
            subtitle={example.subtitle}
            features={example.features}
          />
        ))}
      </div>
    </div>
  )
}
