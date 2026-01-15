import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoComponentProps {
  className?: string;
  textClassName?: string;
  imageClassName?: string;
}

export default function LogoComponent({ className, textClassName, imageClassName }: LogoComponentProps) {
  return (
      <div className={cn("flex items-center relative z-10 gap-1", className)}>
        <div className={cn("w-9 h-9 relative", imageClassName)}>
          <Image 
            src="/logo.svg" 
            alt="Whale Tanks Logo" 
            fill
            className="object-contain"
          />
        </div>

        <h1 className={cn("text-foreground text-3xl font-bold! tracking-tight", textClassName)}>
          Whale Tanks
        </h1>
      </div>
  )
}
