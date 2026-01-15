"use client"

import PricingCard from "../components/PricingCard"

const plans = [
  {
    title: "Basic",
    duration: "3 MONTHS",
    price: "$10",
    saveText: "SAVE 33%",
    monthlyPrice: "$ 33",
    features: [
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
    ],
  },
  {
    title: "Standard",
    duration: "6 Months",
    price: "$50",
    saveText: "SAVE 29%",
    monthlyPrice: "$ 35",
    features: [
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur", isLocked: true },
      { text: "Lorem ipsum dolor sit amet, consectetur", isLocked: true },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
    ],
  },
  {
    title: "Premium",
    duration: "1 Year",
    price: "$100",
    features: [
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur", isLocked: true },
      { text: "Lorem ipsum dolor sit amet, consectetur", isLocked: true },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
      { text: "Lorem ipsum dolor sit amet, consectetur", isLocked: true },
      { text: "Lorem ipsum dolor sit amet, consectetur" },
    ],
  },
]

export default function PricingTemplate() {
  return (
    <div className="w-full container mx-auto min-h-screen max-w-[1440px] px-4 py-12 pt-40 space-y-12 md:px-12">
      <div className="space-y-8 xl:px-16">
        <h1 className="text-[32px] font-semibold text-foreground">Packages and prices</h1>
        
        <div className="text-center p-1">
          <h2 className="text-primary text-[40px] font-black leading-[100%] tracking-normal font-poppins mb-6">Choose a Subscription</h2>
          <p className="text-secondary-foreground text-sm font-medium leading-[100%] tracking-normal font-poppins">Loram your prominence on your portal site</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </div>
  )
}
