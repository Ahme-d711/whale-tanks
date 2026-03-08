"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslations, useLocale } from "next-intl";

interface RevenueAnalyticData {
  name: string;
  profits: number;
  orders: number;
}

export function RevenueOverall({ stats }: { stats: RevenueAnalyticData[] | undefined }) {
  const t = useTranslations("Dashboard");

  const chartData = Array.isArray(stats) ? stats : [];

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-6">
        {t("revenue_overview")}
      </h2>
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-divider">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData.length > 0 ? chartData : weeklyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid 
                strokeDasharray="0" 
                vertical={false} 
                stroke="#F5F5F5"
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                height={50}
                iconType="circle"
                iconSize={10}
                formatter={(value) => <span className="text-sm font-medium text-primary ml-2">{t(value.toLowerCase())}</span>}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 14, fontWeight: 400 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 14, fontWeight: 400 }}
                dx={-10}
                domain={[0, 'auto']}
              />
              
              <Bar
                name="Orders"
                dataKey="orders"
                fill="#E5E7EB"
                radius={[50, 50, 50, 50]}
                barSize={16}
              />
              <Bar
                name="Profits"
                dataKey="profits"
                fill="var(--primary)"
                radius={[50, 50, 50, 50]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const weeklyData = [
  { name: "Sat", profits: 0, orders: 0 },
  { name: "Sun", profits: 0, orders: 0 },
  { name: "Mon", profits: 0, orders: 0 },
  { name: "Tue", profits: 0, orders: 0 },
  { name: "Wed", profits: 0, orders: 0 },
  { name: "Thu", profits: 0, orders: 0 },
  { name: "Fri", profits: 0, orders: 0 },
];
