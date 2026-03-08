"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTranslations, useLocale } from "next-intl";
import { DashboardStats } from "../types/dashboard.types";

interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0, name = "" }: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      <tspan x={x} dy="-0.6em" fontSize="14">{`${(percent * 100).toFixed(0)}%`}</tspan>
      <tspan x={x} dy="1.4em" fontSize="11">{name}</tspan>
    </text>
  );
};

export function OrderStatisticsChart({ stats }: { stats: DashboardStats | undefined }) {
  const t = useTranslations("Dashboard");

  const locale = useLocale();
  const isAr = locale === "ar";
  
  // Colors for categories
  const COLORS = ["#192C56", "#3B4758", "#6F7895", "#A0AEC0", "#CBD5E0", "#EDF2F7"];

  const data = stats?.charts?.ordersByCategory?.map((item, index) => ({
    name: isAr ? item.nameAr : item.nameEn,
    value: item.value,
    color: COLORS[index % COLORS.length]
  })) || [];

  // Fallback if no data
  const chartData = data.length > 0 ? data : [{ name: t("no_data"), value: 1, color: "#E5E7EB" }];

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-[24px] shadow-sm border border-divider">
      <h3 className="text-lg font-bold text-primary mb-6">{t("order_statistics")}</h3>
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
         <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            </PieChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
