"use server";

import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";
import { API_URL, TOKEN_KEY } from "@/utils/constants";

const serverAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

serverAxios.interceptors.request.use(async (config) => {
  const accessToken = (await cookies()).get(TOKEN_KEY)?.value;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

serverAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message &&
      (error.response.data.message.includes("unauthenticated") ||
        error.response.data.message.includes("Unauthenticated") ||
        error.response.status === 401)
    ) {
      // Note: Cookies cannot be deleted during component rendering in Next.js.
      // Authentication status should be handled by the middleware (proxy.ts) 
      // or through manual Logout Server Actions.
      
      // (await cookies()).delete(TOKEN_KEY);
      // (await cookies()).delete("token"); // Note: "token" was old key, can be removed eventually
      delete serverAxios.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

export default serverAxios;
