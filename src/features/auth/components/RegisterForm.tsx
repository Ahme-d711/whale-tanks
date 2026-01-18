"use client"

import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Link } from '@/i18n/routing'
import { AuthInput } from './AuthInput'
import { useRegister } from "../hooks/useAuth"
import ShinyButton from "@/components/shared/ShinyButton"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from 'next-intl'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean(),
})

export default function RegisterForm() {
  const t = useTranslations('Auth')
  const { mutate: register, isPending } = useRegister()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    register(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <fieldset disabled={isPending} className="space-y-4 group-disabled:opacity-50">
            <AuthInput
              control={form.control}
              name="name"
              label={t('name')}
              placeholder={t('name_placeholder')}
              delay={0.1}
            />

            <AuthInput
              control={form.control}
              name="email"
              label={t('email')}
              placeholder={t('email_placeholder')}
              delay={0.2}
            />

            <AuthInput
              control={form.control}
              name="password"
              label={t('password')}
              placeholder={t('password_placeholder')}
              type="password"
              delay={0.3}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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
                      {t('remember_me')}
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
          transition={{ delay: 0.5 }}
        >
          <ShinyButton 
            type="submit" 
            isLoading={isPending}
            loadingText={t('creating_account')}
            className="w-full font-medium!"
          >
            {t('register')}
          </ShinyButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-secondary-foreground"
        >
          {t('already_have_account')}{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            {t('sign_in')}
          </Link>
        </motion.p>
      </form>
    </Form>
  )
}
