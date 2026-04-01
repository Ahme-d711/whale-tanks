import clientAxios from "@/lib/axios/clientAxios";
import { Execution, CreateExecutionData } from "../types/execution.types";

export const executionService = {
  getExecutions: async (skip = 0, limit = 50): Promise<Execution[]> => {
    const response = await clientAxios.get<Execution[]>("executions/", {
      params: { skip, limit },
    });
    return response.data;
  },

  getExecution: async (executionId: string): Promise<Execution> => {
    const response = await clientAxios.get<Execution>(`executions/${executionId}`);
    return response.data;
  },

  createExecution: async (data: CreateExecutionData): Promise<Execution> => {
    const response = await clientAxios.post<Execution>("executions/", data);
    return response.data;
  },
};
