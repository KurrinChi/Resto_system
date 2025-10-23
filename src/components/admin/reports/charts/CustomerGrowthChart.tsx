import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { THEME } from "../../../../constants/theme";

interface CustomerGrowthChartProps {
  data: Array<{ month: string; customers: number }>;
}

export const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({
  data,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={THEME.colors.border.DEFAULT}
        />
        <XAxis
          dataKey="month"
          stroke={THEME.colors.text.secondary}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke={THEME.colors.text.secondary}
          style={{ fontSize: "12px" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: THEME.colors.background.tertiary,
            border: `1px solid ${THEME.colors.border.DEFAULT}`,
            borderRadius: "8px",
            color: THEME.colors.text.primary,
          }}
        />
        <Area
          type="monotone"
          dataKey="customers"
          stroke="#8b5cf6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorCustomers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
