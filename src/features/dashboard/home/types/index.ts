import type { Pagination } from "@/types";

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueData?: RevenueDataPoint[];
  ordersByStatus?: OrderStatusCount[];
  trafficByGovernment?: GovernmentTraffic[];
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
  percentage: number;
}

export interface GovernmentTraffic {
  government: string;
  count: number;
  percentage: number;
}
