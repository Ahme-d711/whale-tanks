export interface User {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  rolesStr?: string[]; // Array of user permissions/roles
  photo?: string | null;
  username?: string;
  phone?: string;
  session_id?: string | null;
  session_expiry?: string | null;
  createdAt?: string;
  [key: string]: any; // Allow additional fields from API
}

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