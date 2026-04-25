import clientAxios from "@/lib/axios/clientAxios";
import { Project } from "../types/project.types";

export const projectService = {
  getProjects: async (skip = 0, limit = 50): Promise<Project[]> => {
    const response = await clientAxios.get<Project[]>("projects", {
      params: { skip, limit },
    });
    return response.data;
  },

  getProject: async (projectId: string): Promise<Project> => {
    const response = await clientAxios.get<Project>(`projects/${projectId}`);
    return response.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await clientAxios.delete(`projects/${projectId}`);
  },
};
