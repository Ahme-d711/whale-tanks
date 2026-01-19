"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"
import { Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { buttonVariants } from "@/components/ui/button"

interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  href?: string
}

export default function ShinyButton({
  children,
  isLoading,
  loadingText = "Loading...",
  className,
  variant,
  size,
  href,
  disabled,
  type,
  ...props
}: ShinyButtonProps) {
  const compClasses = cn(
    buttonVariants({ variant, size, className }),
    "relative overflow-hidden group font-semibold uppercase tracking-wider cursor-pointer h-[45px] rounded-2xl shadow-lg shadow-primary/20 transition-all hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
  )
    
  const content = (
      <>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>
      {!isLoading && (
        <motion.div 
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          initial={false}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      </>
  )

  if (href && !disabled && !isLoading) {
      return (
          <Link href={href} className={compClasses}>
            {content}
          </Link>
      )
  }

  return (
    <button
      className={compClasses}
      disabled={isLoading || disabled}
      type={type}
      {...props}
    >
      {content}
    </button>
  )
}
