"use client"

import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import ShinyButton from "@/components/shared/ShinyButton"
import Link from 'next/link'
import { AuthInput } from './AuthInput'
import { useLogin } from "../hooks/useAuth"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean(),
})

export default function LoginForm() {
  const { mutate: login, isPending } = useLogin()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <fieldset disabled={isPending} className="space-y-4 group-disabled:opacity-50">
            <AuthInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              delay={0.1}
            />

            <AuthInput
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
              type="password"
              delay={0.2}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2"
            >
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-secondary-foreground font-medium cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
            </motion.div>
          </fieldset>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ShinyButton 
            type="submit" 
            isLoading={isPending}
            loadingText="Authenticating..."
            className="w-full font-medium!"
          >
            Sign In
          </ShinyButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-secondary-foreground"
        >
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary cursor-pointer font-semibold hover:underline">
            Sign up
          </Link>
        </motion.p>
      </form>
    </Form>
  )
}
