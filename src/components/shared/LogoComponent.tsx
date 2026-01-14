import Image from "next/image";

export default function LogoComponent() {
  return (
      <div className="flex items-center relative z-10">
        <div className="w-9 h-9 relative">
          <Image 
            src="/logo.svg" 
            alt="Whale Tanks Logo" 
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-foreground text-3xl font-bold! tracking-tight">
          Whale Tanks
        </h1>
      </div>
  )
}
