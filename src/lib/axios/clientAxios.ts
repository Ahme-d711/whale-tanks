"use client";

import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/utils/constants";
import { useAuthStore } from "@/features/auth/stores/authStore";

const clientAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

clientAxios.interceptors.request.use(
  (config) => {
    // Primary auth is via HttpOnly accessToken cookie.
    // Header is only a fallback for non-browser clients.
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

clientAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data.message === "string" &&
      error.response.data.message.toLowerCase().includes("unauthenticated")
    ) {
      // Optional: clear token from store on unauthenticated
      const { setToken } = useAuthStore.getState();
      setToken("");
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
