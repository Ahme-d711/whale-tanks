export interface User {
  user_id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
  // Backward compatibility
  id?: string;
  _id?: string;
  createdAt?: string;
  photo?: string | null;
  picture?: string | null;
  [key: string]: any;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse extends User {}

export interface Sales {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  rating: number;
  branch: string;
  session_id: string | null;
  session_expiry: string | null;
  createdAt: string;
}