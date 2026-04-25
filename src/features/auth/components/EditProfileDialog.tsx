"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import LogoComponent from "@/components/shared/LogoComponent"
import { useAuthStore } from "../stores/authStore"
import { AuthInput } from "./AuthInput"
import ShinyButton from "@/components/shared/ShinyButton"
import { useUpdateProfile } from "../hooks/useAuth"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditProfileDialog({
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const { user } = useAuthStore()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  // Watch user and reset form when user changes (e.g. after update or fresh fetch)
  React.useEffect(() => {
    if (user && open) {
      form.reset({
        name: user.name,
        email: user.email,
      })
    }
  }, [user, open, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Merge new values with existing user data for required fields like role/status
    const updateData = {
      ...user,
      ...values,
    } as any
    
    updateProfile(updateData, {
      onSuccess: () => {
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[440px] rounded-[32px] md:rounded-[40px] p-6 md:p-10 border-none shadow-2xl">
        <DialogHeader className="items-start space-y-4 md:space-y-7 text-left">
          <LogoComponent />
          <DialogTitle className="text-xl md:text-[32px] font-medium text-primary leading-tight">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 mt-4">
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
              type="email"
              delay={0.2}
            />

            <ShinyButton 
              type="submit" 
              isLoading={isPending}
              loadingText="Confirming..."
              className="w-full text-sm md:text-base font-medium! capitalize!"
            >
              Confirm
            </ShinyButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
