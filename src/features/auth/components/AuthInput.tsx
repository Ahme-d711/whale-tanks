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
  const isPassword = type === "password"
  const currentType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs md:text-sm text-foreground font-normal!">{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={currentType}
                  placeholder={placeholder}
                  {...field}
                  className="rounded-xl md:rounded-2xl h-10 md:h-12 border-border focus:border-none transition-all shadow-none placeholder:text-secondary-foreground pr-12 text-sm md:text-base"
                />
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-foreground hover:text-primary transition-colors cursor-pointer"
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
