import clientAxios from "@/lib/axios/clientAxios";
import { AIProvider, CreateProviderData, UpdateProviderData } from "../types/provider.types";

export const providerService = {
  getProviders: async (activeOnly?: boolean): Promise<AIProvider[]> => {
    const params = activeOnly !== undefined ? { active_only: activeOnly } : {};
    const response = await clientAxios.get<AIProvider[]>("/providers", { params });
    return response.data;
  },

  createProvider: async (data: CreateProviderData): Promise<AIProvider> => {
    const response = await clientAxios.post<AIProvider>("/providers", data);
    return response.data;
  },

  updateProvider: async (providerId: string, data: UpdateProviderData): Promise<AIProvider> => {
    const response = await clientAxios.put<AIProvider>(`/providers/${providerId}`, data);
    return response.data;
  },

  deleteProvider: async (providerId: string): Promise<void> => {
    await clientAxios.delete(`/providers/${providerId}`);
  },
};
