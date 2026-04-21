export interface Execution {
  execution_id: string;
  user_id: string;
  model_id: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: string;
  execution_type: string;
  executed_at: string;
}

export interface CreateExecutionData {
  user_id: string;
  model_id: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  execution_type: string;
}

export interface ExecuteRequest {
  prompt: string;
  execution_type: "report" | "analysis" | "summary" | "chat" | "classification";
  model_id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6" for now
  analysis_type?: string; 
  session_id?: string;
  tier?: string;
  extra?: Record<string, any>;
}

export interface ExecuteResponse {
  execution_id: string;
  execution_type: string;
  result: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  user_cost: string;
  internal_cost: string;
}

export interface ChatSession {
  session_id: string;
  title: string;
  preview: string;
  turn_count: number;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessagePair {
  turn: number;
  question: {
    content: string;
    created_at: string;
  };
  answer: {
    content: string;
    created_at: string;
    execution_id: string;
  };
}

export interface SessionMessagesResponse {
  session_id: string;
  turn_count: number;
  pairs: MessagePair[];
}
