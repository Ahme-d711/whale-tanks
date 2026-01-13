import { useMutation } from "@tanstack/react-query"
import { authService } from "../services/auth.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const useLogin = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.user.name}!`, {
        description: "You have successfully signed in.",
      })
      // In a real app, you would store the token here
      console.log("Token stored:", data.token)
      router.push("/dashboard") // Redirect to dashboard (mock)
    },
    onError: (error: Error) => {
      toast.error("Login Failed", {
        description: error.message,
      })
    },
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success("Account Created!", {
        description: "Please check your email to verify your account.",
      })
      router.push("/login")
    },
    onError: (error: Error) => {
      toast.error("Registration Failed", {
        description: error.message,
      })
    },
  })
}
