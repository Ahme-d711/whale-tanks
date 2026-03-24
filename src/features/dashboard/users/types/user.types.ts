import { User } from "@/features/auth/types";

export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole = "admin" | "user" | "editor";

export interface UserDashboard extends User {
  status: UserStatus;
  role: UserRole;
}
