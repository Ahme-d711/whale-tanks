"use client"

import React from 'react'
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
            <FormLabel className="text-foreground font-normal!">{label}</FormLabel>
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                className="rounded-2xl h-12 border-border focus:border-none transition-all shadow-none placeholder:text-secondary-foreground"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  )
}
