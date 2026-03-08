export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  userId?: string;
  recipientName?: string;
  paymentMethod?: string;
}
export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  newUsersLast30Days: number;
}

export interface MonthlyRevenueData {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  summary: DashboardSummary;
  ordersByStatus: { [key: string]: number };
  charts: {
    ordersByCategory: { nameAr: string; nameEn: string; value: number }[];
    monthlyRevenue: MonthlyRevenueData[];
    ordersByGovernorate: { name: string; value: number }[];
  };
  recentOrders: Order[];
}
