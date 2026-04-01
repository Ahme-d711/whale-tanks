import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { setCookie } from "@/utils/cookies";
import { TOKEN_KEY } from "@/utils/constants";
import { LoginCredentials, RegisterData, UpdateProfileData } from "../types";

export const useLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { setToken } = useAuthStore();

  const mutate = useCallback(async (credentials: LoginCredentials) => {
    setIsPending(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.access_token);
      setCookie(TOKEN_KEY, data.access_token);
      toast.success("Login Successful", {
        description: "You have successfully signed in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Login failed";
      toast.error("Login Failed", {
        description: message,
      });
    } finally {
      setIsPending(false);
    }
  }, [router, setToken]);

  return { mutate, isPending };
};

export const useRegister = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const mutate = useCallback(async (data: RegisterData) => {
    setIsPending(true);
    try {
      await authService.register(data);
      toast.success("Account Created!", {
        description: "Your account has been created successfully. Please login.",
      });
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Registration failed";
      toast.error("Registration Failed", {
        description: message,
      });
    } finally {
      setIsPending(false);
    }
  }, [router]);

  return { mutate, isPending };
};

export const useProfile = (enabled = true) => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!user && enabled);
  const [error, setError] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const data = await authService.getProfile();
      setUser(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, setUser]);

  useEffect(() => {
    if (enabled && !user) {
      fetchProfile();
    }
  }, [enabled, user, fetchProfile]);

  return { data: user, isLoading, error, refetch: fetchProfile };
};

export const useUpdateProfile = () => {
  const [isPending, setIsPending] = useState(false);
  const { setUser } = useAuthStore();

  const mutate = useCallback(async (data: UpdateProfileData) => {
    setIsPending(true);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Update failed";
      toast.error("Update Failed", {
        description: message,
      });
    } finally {
      setIsPending(false);
    }
  }, [setUser]);

  return { mutate, isPending };
};
