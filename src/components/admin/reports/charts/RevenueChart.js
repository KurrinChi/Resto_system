import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { THEME } from "../../../../constants/theme";
export const RevenueChart = ({ data }) => {
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: THEME.colors.border.DEFAULT }), _jsx(XAxis, { dataKey: "date", stroke: THEME.colors.text.secondary, style: { fontSize: "12px" } }), _jsx(YAxis, { stroke: THEME.colors.text.secondary, style: { fontSize: "12px" } }), _jsx(Tooltip, { contentStyle: {
                        backgroundColor: THEME.colors.background.tertiary,
                        border: `1px solid ${THEME.colors.border.DEFAULT}`,
                        borderRadius: "8px",
                        color: THEME.colors.text.primary,
                    } }), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#3b82f6", strokeWidth: 2, dot: { fill: "#3b82f6", r: 4 }, activeDot: { r: 6 } })] }) }));
};
