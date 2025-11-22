import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Save, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../../common/Button";
import { Badge } from "../../common/Badge";
import { AvailabilitySchedule } from "./AvailabilitySchedule";
import { THEME } from "../../../constants/theme";
// Mock data
const mockAvailability = [
    {
        id: "1",
        dayOfWeek: "Monday",
        openTime: "09:00",
        closeTime: "22:00",
        isOpen: true,
    },
    {
        id: "2",
        dayOfWeek: "Tuesday",
        openTime: "09:00",
        closeTime: "22:00",
        isOpen: true,
    },
    {
        id: "3",
        dayOfWeek: "Wednesday",
        openTime: "09:00",
        closeTime: "22:00",
        isOpen: true,
    },
    {
        id: "4",
        dayOfWeek: "Thursday",
        openTime: "09:00",
        closeTime: "22:00",
        isOpen: true,
    },
    {
        id: "5",
        dayOfWeek: "Friday",
        openTime: "09:00",
        closeTime: "23:00",
        isOpen: true,
    },
    {
        id: "6",
        dayOfWeek: "Saturday",
        openTime: "10:00",
        closeTime: "23:00",
        isOpen: true,
    },
    {
        id: "7",
        dayOfWeek: "Sunday",
        openTime: "10:00",
        closeTime: "21:00",
        isOpen: false,
    },
];
export const RestaurantAvailability = () => {
    const [availability, setAvailability] = useState(mockAvailability);
    const [restaurantStatus, setRestaurantStatus] = useState("open");
    const [hasChanges, setHasChanges] = useState(false);
    const handleToggleDay = (dayId) => {
        setAvailability(availability.map((day) => day.id === dayId ? { ...day, isOpen: !day.isOpen } : day));
        setHasChanges(true);
    };
    const handleTimeChange = (dayId, field, value) => {
        setAvailability(availability.map((day) => day.id === dayId ? { ...day, [field]: value } : day));
        setHasChanges(true);
    };
    const handleSaveChanges = () => {
        // TODO: Implement API call
        console.log("Saving availability changes:", availability);
        alert("Availability schedule saved successfully!");
        setHasChanges(false);
    };
    const handleToggleRestaurant = () => {
        const newStatus = restaurantStatus === "open" ? "closed" : "open";
        setRestaurantStatus(newStatus);
        alert(`Restaurant is now ${newStatus.toUpperCase()}`);
    };
    const currentlyOpen = availability.filter((day) => day.isOpen).length;
    return (_jsxs("div", { className: "space-y-6 h-full overflow-y-auto pb-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Restaurant Availability" }), _jsx("p", { className: "mt-1", style: { color: THEME.colors.text.secondary }, children: "Manage your restaurant's operating hours" })] }), hasChanges && (_jsx(Button, { onClick: handleSaveChanges, icon: _jsx(Save, { className: "w-5 h-5" }), children: "Save Changes" }))] }), _jsx("div", { className: "p-6 rounded-2xl border", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Restaurant Status" }), _jsx(Badge, { variant: restaurantStatus === "open" ? "success" : "error", size: "lg", children: restaurantStatus === "open" ? "OPEN" : "CLOSED" })] }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Instantly open or close the restaurant for new orders" })] }), _jsx(Button, { onClick: handleToggleRestaurant, variant: restaurantStatus === "open" ? "danger" : "success", icon: restaurantStatus === "open" ? (_jsx(ToggleRight, { className: "w-5 h-5" })) : (_jsx(ToggleLeft, { className: "w-5 h-5" })), size: "lg", children: restaurantStatus === "open"
                                ? "Close Restaurant"
                                : "Open Restaurant" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(59, 130, 246, 0.1)" }, children: _jsx(Clock, { className: "w-6 h-6", style: { color: "#3b82f6" } }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: [currentlyOpen, "/7"] }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Days Open" })] })] }) }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(16, 185, 129, 0.1)" }, children: _jsx(Clock, { className: "w-6 h-6", style: { color: "#10b981" } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: availability.find((d) => d.dayOfWeek === "Monday")?.openTime ||
                                                "N/A" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Typical Opening" })] })] }) }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(139, 92, 246, 0.1)" }, children: _jsx(Clock, { className: "w-6 h-6", style: { color: "#8b5cf6" } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: availability.find((d) => d.dayOfWeek === "Monday")
                                                ?.closeTime || "N/A" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Typical Closing" })] })] }) })] }), _jsxs("div", { className: "rounded-2xl border overflow-hidden", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: [_jsxs("div", { className: "px-6 py-4 border-b", style: { borderColor: THEME.colors.border.DEFAULT }, children: [_jsx("h3", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Weekly Operating Hours" }), _jsx("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: "Set your restaurant's hours for each day of the week" })] }), _jsx("div", { className: "p-6", children: _jsx(AvailabilitySchedule, { availability: availability, onToggleDay: handleToggleDay, onTimeChange: handleTimeChange }) })] }), _jsx("div", { className: "rounded-2xl border overflow-hidden", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsxs("div", { className: "p-6 rounded-lg", style: {
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                        borderWidth: "1px",
                        borderColor: "rgba(245, 158, 11, 0.3)",
                    }, children: [_jsx("h4", { className: "font-semibold mb-2", style: { color: THEME.colors.text.primary }, children: "Special Hours & Holidays" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.secondary }, children: "For special events, holidays, or temporary closures, you can override the regular schedule. Contact support to set up special hours." })] }) })] }));
};
