import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "../../common/Badge";
import { THEME } from "../../../constants/theme";
export const AvailabilitySchedule = ({ availability, onToggleDay, onTimeChange, }) => {
    return (_jsx("div", { className: "space-y-3", children: availability.map((day) => (_jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border transition-all", style: {
                backgroundColor: day.isOpen
                    ? THEME.colors.background.secondary
                    : THEME.colors.background.tertiary,
                borderColor: THEME.colors.border.DEFAULT,
            }, children: [_jsxs("div", { className: "flex items-center justify-between md:w-48", children: [_jsx("span", { className: "font-medium", style: { color: THEME.colors.text.primary }, children: day.dayOfWeek }), _jsx("button", { onClick: () => onToggleDay(day.id), className: "md:hidden", children: _jsx(Badge, { variant: day.isOpen ? "success" : "error", children: day.isOpen ? "Open" : "Closed" }) })] }), day.isOpen ? (_jsxs("div", { className: "flex-1 grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs mb-1", style: { color: THEME.colors.text.tertiary }, children: "Opening Time" }), _jsx("input", { type: "time", value: day.openTime, onChange: (e) => onTimeChange(day.id, "openTime", e.target.value), className: "w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                        backgroundColor: THEME.colors.background.tertiary,
                                        color: THEME.colors.text.primary,
                                        borderWidth: "1px",
                                        borderColor: THEME.colors.border.DEFAULT,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs mb-1", style: { color: THEME.colors.text.tertiary }, children: "Closing Time" }), _jsx("input", { type: "time", value: day.closeTime, onChange: (e) => onTimeChange(day.id, "closeTime", e.target.value), className: "w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                        backgroundColor: THEME.colors.background.tertiary,
                                        color: THEME.colors.text.primary,
                                        borderWidth: "1px",
                                        borderColor: THEME.colors.border.DEFAULT,
                                    } })] })] })) : (_jsx("div", { className: "flex-1 flex items-center", style: { color: THEME.colors.text.muted }, children: _jsx("p", { className: "text-sm", children: "Closed all day" }) })), _jsx("div", { className: "hidden md:flex md:w-32 md:justify-end", children: _jsx("button", { onClick: () => onToggleDay(day.id), children: _jsx(Badge, { variant: day.isOpen ? "success" : "error", size: "lg", children: day.isOpen ? "Open" : "Closed" }) }) })] }, day.id))) }));
};
