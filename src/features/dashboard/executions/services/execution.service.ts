import clientAxios from "@/lib/axios/clientAxios";
import { Execution, CreateExecutionData, ExecuteRequest, ExecuteResponse, ChatSession, SessionMessagesResponse } from "../types/execution.types";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { API_URL } from "@/utils/constants";

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

  execute: async (data: ExecuteRequest): Promise<ExecuteResponse> => {
    const response = await clientAxios.post<ExecuteResponse>("execute", data);
    return response.data;
  },

  streamExecute: async (data: ExecuteRequest, onUpdate: (data: { text?: string; session_id?: string }) => void): Promise<void> => {
    const token = useAuthStore.getState().token;
    
    const response = await fetch(`${API_URL}execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : "",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let currentLine = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      currentLine += chunk;

      const lines = currentLine.split("\n");
      // Keep the last partial line
      currentLine = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.replace("data: ", "").trim();
            if (jsonStr === "[DONE]") return;
            const jsonData = JSON.parse(jsonStr);
            onUpdate(jsonData);
          } catch (e) {
            console.error("Error parsing SSE chunk:", e, line);
          }
        }
      }
    }
  },
  
  getSessions: async (): Promise<ChatSession[]> => {
    const response = await clientAxios.get<ChatSession[]>("execute/sessions");
    return response.data;
  },

  getSessionMessages: async (sessionId: string): Promise<SessionMessagesResponse> => {
    const response = await clientAxios.get<SessionMessagesResponse>(`execute/sessions/${sessionId}/messages`);
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await clientAxios.delete(`execute/sessions/${sessionId}`);
  },
};


