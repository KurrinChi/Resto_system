import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { THEME } from "../../../../constants/theme";

interface TopItemsChartProps {
  data: Array<{ name: string; sales: number }>;
}

export const TopItemsChart: React.FC<TopItemsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={THEME.colors.border.DEFAULT}
        />
        <XAxis
          type="number"
          stroke={THEME.colors.text.secondary}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke={THEME.colors.text.secondary}
          style={{ fontSize: "12px" }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: THEME.colors.background.tertiary,
            border: `1px solid ${THEME.colors.border.DEFAULT}`,
            borderRadius: "8px",
            color: THEME.colors.text.primary,
          }}
        />
        <Bar dataKey="sales" fill="#10b981" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
