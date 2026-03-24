import clientAxios from "@/lib/axios/clientAxios";
import { Package, CreatePackageData, UpdatePackageData } from "../types/package.types";

export const packageService = {
  getPackages: async (active_only?: boolean): Promise<Package[]> => {
    const response = await clientAxios.get("/packages/", {
      params: { 
        ...(active_only !== undefined && { active_only })
      }
    });
    return response.data;
  },

  getPackage: async (packageId: string): Promise<Package> => {
    const response = await clientAxios.get(`/packages/${packageId}`);
    return response.data;
  },

  createPackage: async (data: CreatePackageData): Promise<Package> => {
    const response = await clientAxios.post("/packages/", data);
    return response.data;
  },

  updatePackage: async (packageId: string, data: UpdatePackageData): Promise<Package> => {
    const response = await clientAxios.put(`/packages/${packageId}`, data);
    return response.data;
  },

  deletePackage: async (packageId: string): Promise<void> => {
    await clientAxios.delete(`/packages/${packageId}`);
  },
};
