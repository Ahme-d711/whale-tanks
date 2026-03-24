import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { setCookie } from "@/utils/cookies";
import { TOKEN_KEY } from "@/utils/constants";

export const useLogin = () => {
  const router = useRouter();
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setToken(data.access_token);
      setCookie(TOKEN_KEY, data.access_token);
      toast.success("Login Successful", {
        description: "You have successfully signed in.",
      });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Login failed";
      toast.error("Login Failed", {
        description: message,
      });
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Account Created!", {
        description: "Your account has been created successfully. Please login.",
      });
      router.push("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Registration failed";
      toast.error("Registration Failed", {
        description: message,
      });
    },
  });
};

export const useProfile = (enabled = true) => {
  const { setUser, clearAuth } = useAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    enabled,
    staleTime: Infinity,
  });
};
