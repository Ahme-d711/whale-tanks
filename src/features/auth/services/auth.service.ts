import clientAxios from "@/lib/axios/clientAxios";
import { LoginResponse, RegisterResponse, LoginCredentials, RegisterData, User, UpdateProfileData } from "../types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await clientAxios.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await clientAxios.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await clientAxios.get<User>("/users/me");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await clientAxios.put<User>("/users/me", data);
    return response.data;
  },
};
