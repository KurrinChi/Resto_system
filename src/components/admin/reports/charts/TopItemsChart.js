import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { THEME } from "../../../../constants/theme";
export const TopItemsChart = ({ data }) => {
    return (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: THEME.colors.border.DEFAULT }), _jsx(XAxis, { type: "number", stroke: THEME.colors.text.secondary, style: { fontSize: "12px" } }), _jsx(YAxis, { type: "category", dataKey: "name", stroke: THEME.colors.text.secondary, style: { fontSize: "12px" }, width: 100 }), _jsx(Tooltip, { contentStyle: {
                        backgroundColor: THEME.colors.background.tertiary,
                        border: `1px solid ${THEME.colors.border.DEFAULT}`,
                        borderRadius: "8px",
                        color: THEME.colors.text.primary,
                    } }), _jsx(Bar, { dataKey: "sales", fill: "#10b981", radius: [0, 8, 8, 0] })] }) }));
};
