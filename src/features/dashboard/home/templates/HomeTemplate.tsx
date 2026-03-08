"use client"
import { Download } from 'lucide-react'
import { useHome } from '../hooks/useHome'

import { StatsGrid } from '../components/StatsGrid'
import { ChartsSection } from '../components/ChartsSection'

import { useTranslations } from 'next-intl'

import { PageTransition } from "@/components/shared/PageTransition";
import { motion } from "framer-motion";
import { OrderStatisticsChart } from '../components/OrderStatisticsChart'
import { TrafficByGovernmentChart } from '../components/TrafficByGovernmentChart'
import { PageHeader } from "@/components/shared/PageHeader";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { exportToExcel } from "@/utils/excelExport";
import { format } from "date-fns";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HomeTemplate() {
  const { isLoading, stats } = useHome()
  const t = useTranslations("Dashboard")
  const tCommon = useTranslations("Common")
  const tOrders = useTranslations("Orders")

  const handleExport = () => {
    if (!stats) return;

    // 1. Format Summary Stats
    const summaryData = [
      {
        [t("total_users")]: stats.summary.totalUsers,
        [t("total_products")]: stats.summary.totalProducts,
        [t("total_orders")]: stats.summary.totalOrders,
        [t("total_revenue")]: `${stats.summary.totalRevenue.toFixed(2)} ${tCommon("currency")}`,
        [t("new_users_30d")]: stats.summary.newUsersLast30Days,
      }
    ];

    // 2. Format Recent Orders
    const ordersData = stats.recentOrders.map((order) => ({
      [tOrders("order_id")]: order._id?.toString().slice(-6).toUpperCase(),
      [tOrders("customer")]: (order.userId as any)?.name || order.recipientName,
      [tOrders("date")]: order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy") : "-",
      [tOrders("total")]: `${order.totalAmount?.toFixed(2) || "0.00"} ${tCommon("currency")}`,
      [tOrders("status")]: tOrders(order.status.toLowerCase() as any),
      [tOrders("payment")]: tOrders(`payment_${order.paymentMethod?.toLowerCase()}` as any),
    }));

    // Export with multiple sheets if possible, or combine
    // For now, let's export the summary first, or we can suggest a more complex export later.
    // The current utility supports one sheet. Let's combine them or just export orders as it's more "table-like".
    // Actually, let's just export the orders for now as it's the most valuable data for export,
    // and maybe add a few rows at the top for summary.
    
    const combinedData = [
      { [tOrders("order_id")]: "--- SUMMARY ---", [tOrders("customer")]: "", [tOrders("date")]: "", [tOrders("total")]: "", [tOrders("status")]: "", [tOrders("payment")]: "" },
      { [tOrders("order_id")]: t("total_users"), [tOrders("customer")]: stats.summary.totalUsers, [tOrders("date")]: "", [tOrders("total")]: "", [tOrders("status")]: "", [tOrders("payment")]: "" },
      { [tOrders("order_id")]: t("total_revenue"), [tOrders("customer")]: `${stats.summary.totalRevenue.toFixed(2)} ${tCommon("currency")}`, [tOrders("date")]: "", [tOrders("total")]: "", [tOrders("status")]: "", [tOrders("payment")]: "" },
      { [tOrders("order_id")]: "", [tOrders("customer")]: "", [tOrders("date")]: "", [tOrders("total")]: "", [tOrders("status")]: "", [tOrders("payment")]: "" },
      { [tOrders("order_id")]: "--- RECENT ORDERS ---", [tOrders("customer")]: "", [tOrders("date")]: "", [tOrders("total")]: "", [tOrders("status")]: "", [tOrders("payment")]: "" },
      ...ordersData
    ];

    exportToExcel(combinedData, {
      filename: `Dashboard_Report_${format(new Date(), "yyyy-MM-dd")}.xlsx`,
      sheetName: "Dashboard Overview",
    });
  };

  if (isLoading) return <HomeSkeleton />

  return (
    <PageTransition>
      <motion.div 
        className="space-y-8 pb-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header Section */}
        <motion.div variants={item}>
          <PageHeader
            title={t("title")}
            description={t("subtitle")}
            actionButtons={[
              {
                label: t("export_report"),
                icon: Download,
                variant: "secondary",
                onClick: handleExport
              }
            ]}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item}>
          <StatsGrid stats={stats} isLoading={isLoading} />
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <div className="lg:col-span-1">
            <OrderStatisticsChart stats={stats} />
          </div>
          <div className="lg:col-span-2">
            <TrafficByGovernmentChart stats={stats} />
          </div>
        </motion.div>

        {/* Charts & Recent Orders */}
        <motion.div variants={item} className="space-y-8">
          <ChartsSection />
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
