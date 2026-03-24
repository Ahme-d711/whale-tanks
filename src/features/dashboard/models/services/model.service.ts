import clientAxios from "@/lib/axios/clientAxios";
import { AIModel, CreateModelData, UpdateModelData } from "../types/model.types";

export const modelService = {
  getModels: async (activeOnly?: boolean): Promise<AIModel[]> => {
    const params = activeOnly !== undefined ? { active_only: activeOnly } : {};
    const response = await clientAxios.get<AIModel[]>("/models", { params });
    return response.data;
  },

  createModel: async (data: CreateModelData): Promise<AIModel> => {
    const response = await clientAxios.post<AIModel>("/models", data);
    return response.data;
  },

  updateModel: async (modelId: string, data: UpdateModelData): Promise<AIModel> => {
    const response = await clientAxios.put<AIModel>(`/models/${modelId}`, data);
    return response.data;
  },

  deleteModel: async (modelId: string): Promise<void> => {
    await clientAxios.delete(`/models/${modelId}`);
  },
};
