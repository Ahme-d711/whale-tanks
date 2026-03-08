"use client";

import clientAxios from "@/lib/axios/clientAxios";

export const getDashboardStats = async () => {
  const response = await clientAxios.get("/dashboard/stats");
  return response.data.data;
};

export const getRevenueAnalytics = async (period: string) => {
  const response = await clientAxios.get("/dashboard/revenue-analytics", { params: { period } });
  return response.data.data;
};
