import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { THEME } from "../../../../constants/theme";
export const CustomerGrowthChart = ({ data, }) => {
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: data, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorCustomers", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#8b5cf6", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#8b5cf6", stopOpacity: 0.1 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: THEME.colors.border.DEFAULT }), _jsx(XAxis, { dataKey: "month", stroke: THEME.colors.text.secondary, style: { fontSize: "12px" } }), _jsx(YAxis, { stroke: THEME.colors.text.secondary, style: { fontSize: "12px" } }), _jsx(Tooltip, { contentStyle: {
                        backgroundColor: THEME.colors.background.tertiary,
                        border: `1px solid ${THEME.colors.border.DEFAULT}`,
                        borderRadius: "8px",
                        color: THEME.colors.text.primary,
                    } }), _jsx(Area, { type: "monotone", dataKey: "customers", stroke: "#8b5cf6", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorCustomers)" })] }) }));
};
