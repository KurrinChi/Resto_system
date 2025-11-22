import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, } from "recharts";
import { THEME } from "../../../../constants/theme";
const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];
export const OrdersDonutChart = ({ data }) => {
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 100, fill: "#8884d8", paddingAngle: 5, dataKey: "value", label: (entry) => entry.name, children: data.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                        backgroundColor: THEME.colors.background.tertiary,
                        border: `1px solid ${THEME.colors.border.DEFAULT}`,
                        borderRadius: "8px",
                        color: THEME.colors.text.primary,
                    } }), _jsx(Legend, { wrapperStyle: { color: THEME.colors.text.primary }, iconType: "circle" })] }) }));
};
