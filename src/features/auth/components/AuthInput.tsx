import React, { useState } from 'react'
import { motion } from "motion/react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

interface AuthInputProps {
  control: Control<any>
  name: string
  label: string
  placeholder: string
  type?: string
  delay?: number
}

export const AuthInput = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  delay = 0,
}: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const isPassword = type === "password"
  const currentType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <motion.div
      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("w-full", isRtl ? "text-right" : "text-left")}>
            <FormLabel className="text-xs md:text-sm text-foreground font-normal! w-full block">{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={currentType}
                  placeholder={placeholder}
                  {...field}
                  className={cn(
                    "rounded-xl md:rounded-2xl h-10 md:h-12 border-border focus:border-none transition-all shadow-none placeholder:text-secondary-foreground text-sm md:text-base w-full",
                    isRtl ? "pl-12 pr-4 text-right" : "pr-12 pl-4 text-left"
                  )}
                />
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-secondary-foreground hover:text-primary transition-colors cursor-pointer",
                      isRtl ? "left-4" : "right-4"
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  )
}
