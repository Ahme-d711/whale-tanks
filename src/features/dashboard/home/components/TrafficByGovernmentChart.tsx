"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { DashboardStats } from "../types/dashboard.types";

const COLORS = ["#192C56", "#6F7895", "#A0AEC0", "#CBD2DC", "#000000", "#45516B"];

import { useTranslations } from "next-intl";

export function TrafficByGovernmentChart({ stats }: { stats: DashboardStats | undefined }) {
  const t = useTranslations("Dashboard");

  const chartData = (stats?.charts?.ordersByGovernorate || []).map((item, index) => ({
    name: item.name,
    value: item.value,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-divider h-full">
      <h3 className="text-lg font-bold text-primary mb-8">{t("traffic_by_gov")}</h3>
      <div className="w-full h-[300px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-content-tertiary">
             {t("no_data") || "No data available"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
              barSize={32}
            >
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6B7280", fontSize: 13 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                allowDecimals={false}
                dx={-10}
              />
              <Bar dataKey="value" radius={[16, 16, 16, 16]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
