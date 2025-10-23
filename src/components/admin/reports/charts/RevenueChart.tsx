import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { THEME } from "../../../../constants/theme";

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={THEME.colors.border.DEFAULT}
        />
        <XAxis
          dataKey="date"
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
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: "#3b82f6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
