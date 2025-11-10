import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { THEME } from "../../../../constants/theme";

interface OrdersDonutChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];

export const OrdersDonutChart: React.FC<OrdersDonutChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={(entry) => entry.name}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: THEME.colors.background.tertiary,
            border: `1px solid ${THEME.colors.border.DEFAULT}`,
            borderRadius: "8px",
            color: THEME.colors.text.primary,
          }}
        />
        <Legend
          wrapperStyle={{ color: THEME.colors.text.primary }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
