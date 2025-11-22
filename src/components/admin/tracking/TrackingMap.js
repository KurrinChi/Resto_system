import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapPin } from "lucide-react";
import { THEME } from "../../../constants/theme";
export const TrackingMap = ({ selectedTracking, trackingData, }) => {
    // TODO: Implement actual map integration (Google Maps, Mapbox, Leaflet, etc.)
    const activeDeliveries = trackingData.filter((t) => t.location && t.status !== "delivered");
    return (_jsx("div", { className: "h-96 rounded-lg flex items-center justify-center relative", style: {
            backgroundColor: THEME.colors.background.tertiary,
            borderWidth: "1px",
            borderColor: THEME.colors.border.DEFAULT,
        }, children: _jsxs("div", { className: "text-center", children: [_jsx(MapPin, { className: "w-16 h-16 mx-auto mb-4", style: { color: THEME.colors.text.tertiary } }), _jsx("p", { className: "text-lg font-medium mb-2", style: { color: THEME.colors.text.primary }, children: "Map Integration" }), _jsxs("p", { className: "text-sm mb-4", style: { color: THEME.colors.text.tertiary }, children: [activeDeliveries.length, " active", " ", activeDeliveries.length === 1 ? "delivery" : "deliveries"] }), selectedTracking && (_jsxs("div", { className: "mt-4 p-4 rounded-lg inline-block", style: {
                        backgroundColor: THEME.colors.background.secondary,
                        borderWidth: "1px",
                        borderColor: THEME.colors.border.DEFAULT,
                    }, children: [_jsx("p", { className: "font-semibold mb-1", style: { color: THEME.colors.text.primary }, children: selectedTracking.orderNumber }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.secondary }, children: selectedTracking.customerName })] })), _jsx("p", { className: "text-xs mt-4", style: { color: THEME.colors.text.muted }, children: "Integrate Google Maps, Mapbox, or Leaflet here" })] }) }));
};
