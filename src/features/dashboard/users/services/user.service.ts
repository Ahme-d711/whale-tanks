import clientAxios from "@/lib/axios/clientAxios";
import { UserDashboard } from "../types/user.types";

export const userService = {
  getUsers: async (skip = 0, limit = 10, status?: string): Promise<UserDashboard[]> => {
    const response = await clientAxios.get<UserDashboard[]>("/users/", {
      params: { 
        skip, 
        limit,
        ...(status && { status })
      },
    });
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<UserDashboard>): Promise<UserDashboard> => {
    const response = await clientAxios.put<UserDashboard>(`/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await clientAxios.delete(`/users/${userId}`);
  },
};
