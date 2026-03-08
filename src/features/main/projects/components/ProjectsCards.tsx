"use client"

import { ServiceCard } from "@/components/shared/ServiceCard"
import { Plus } from "lucide-react"

const projects = [
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
    icon: "/clothes.svg",
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
    icon: "/clothes.svg",
    title: "Restaurant Project",
    subtitle: "Blue Whale",
    features: [
      "A modern digital platform designed for restaurants to showcase their menu, brand identity, and dining experience through a clean and intuitive interface.",
      "The project focuses on clear menu presentation, smooth navigation, and visually engaging layouts that enhance the customer's journey from discovery to decision."
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

export default function ProjectsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl! mx-auto justify-items-start">
      {/* Add New Project Card */}
      <div className="backdrop-blur-xl w-full max-w-[390px] bg-background rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border flex items-center justify-center min-h-[300px] cursor-pointer group">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
            <Plus className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            Add New Project
          </p>
        </div>
      </div>

      {/* Project Cards */}
      {projects.map((project, index) => (
        <ServiceCard
          key={index}
          icon={project.icon}
          title={project.title}
          subtitle={project.subtitle}
          features={project.features}
        />
      ))}
    </div>
  )
}
