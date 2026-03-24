import { UserDashboard } from "../types/user.types";

export const mockUsers: UserDashboard[] = [
  {
    user_id: "1",
    name: "Ahmed Ali",
    email: "ahmed.ali@example.com",
    role: "admin",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    photo: null,
  } as UserDashboard,
  {
    user_id: "2",
    name: "Mohamed Hassan",
    email: "mohamed.h@example.com",
    role: "user",
    status: "active",
    created_at: "2024-02-10T14:45:00Z",
    photo: null,
  } as UserDashboard,
  {
    user_id: "3",
    name: "Sara Mahmoud",
    email: "sara.m@example.com",
    role: "editor",
    status: "inactive",
    created_at: "2024-03-01T09:20:00Z",
    photo: null,
  } as UserDashboard,
  {
    user_id: "4",
    name: "Omar Khaled",
    email: "omar.k@example.com",
    role: "user",
    status: "suspended",
    created_at: "2024-03-05T16:00:00Z",
    photo: null,
  } as UserDashboard,
  {
    user_id: "5",
    name: "Laila Yassin",
    email: "laila.y@example.com",
    role: "user",
    status: "active",
    created_at: "2024-03-07T11:15:00Z",
    photo: null,
  } as UserDashboard,
];
