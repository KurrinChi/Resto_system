import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar } from "lucide-react";
import { THEME } from "../../../constants/theme";
export const ReportFilters = ({ dateRange, onDateRangeChange, reportType, onReportTypeChange, }) => {
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: [_jsx(Calendar, { className: "w-4 h-4 inline mr-1" }), "Start Date"] }), _jsx("input", { type: "date", value: dateRange.start, onChange: (e) => onDateRangeChange({ ...dateRange, start: e.target.value }), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                            backgroundColor: THEME.colors.background.tertiary,
                            color: THEME.colors.text.primary,
                            borderWidth: "1px",
                            borderColor: THEME.colors.border.DEFAULT,
                        } })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: [_jsx(Calendar, { className: "w-4 h-4 inline mr-1" }), "End Date"] }), _jsx("input", { type: "date", value: dateRange.end, onChange: (e) => onDateRangeChange({ ...dateRange, end: e.target.value }), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                            backgroundColor: THEME.colors.background.tertiary,
                            color: THEME.colors.text.primary,
                            borderWidth: "1px",
                            borderColor: THEME.colors.border.DEFAULT,
                        } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: "Report Type" }), _jsxs("select", { value: reportType, onChange: (e) => onReportTypeChange(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                            backgroundColor: THEME.colors.background.tertiary,
                            color: THEME.colors.text.primary,
                            borderWidth: "1px",
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("option", { value: "sales", children: "Sales Report" }), _jsx("option", { value: "orders", children: "Orders Report" }), _jsx("option", { value: "customers", children: "Customers Report" }), _jsx("option", { value: "inventory", children: "Inventory Report" })] })] })] }));
};
