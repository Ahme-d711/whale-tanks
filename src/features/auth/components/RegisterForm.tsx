"use client"

import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import Link from 'next/link'
import { AuthInput } from './AuthInput'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AuthInput
            control={form.control}
            name="name"
            label="Name"
            placeholder="Your full name"
            delay={0.1}
          />

          <AuthInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Your email address"
            delay={0.2}
          />

          <AuthInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Your password"
            type="password"
            delay={0.3}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold cursor-pointer bg-primary hover:bg-blue-700 transition-all uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20 relative overflow-hidden group"
          >
            <span className="relative z-10">Sign Up</span>
            <motion.div 
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              initial={false}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-secondary-foreground"
        >
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </motion.p>
      </form>
    </Form>
  )
}
