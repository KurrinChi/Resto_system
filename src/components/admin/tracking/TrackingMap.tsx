import React from "react";
import { MapPin } from "lucide-react";
import { THEME } from "../../../constants/theme";
import type { CustomerTracking } from "../../../types";

interface TrackingMapProps {
  selectedTracking: CustomerTracking | null;
  trackingData: CustomerTracking[];
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  selectedTracking,
  trackingData,
}) => {
  // TODO: Implement actual map integration (Google Maps, Mapbox, Leaflet, etc.)

  const activeDeliveries = trackingData.filter(
    (t) => t.location && t.status !== "delivered"
  );

  return (
    <div
      className="h-96 rounded-lg flex items-center justify-center relative"
      style={{
        backgroundColor: THEME.colors.background.tertiary,
        borderWidth: "1px",
        borderColor: THEME.colors.border.DEFAULT,
      }}
    >
      {/* Placeholder for map */}
      <div className="text-center">
        <MapPin
          className="w-16 h-16 mx-auto mb-4"
          style={{ color: THEME.colors.text.tertiary }}
        />
        <p
          className="text-lg font-medium mb-2"
          style={{ color: THEME.colors.text.primary }}
        >
          Map Integration
        </p>
        <p
          className="text-sm mb-4"
          style={{ color: THEME.colors.text.tertiary }}
        >
          {activeDeliveries.length} active{" "}
          {activeDeliveries.length === 1 ? "delivery" : "deliveries"}
        </p>
        {selectedTracking && (
          <div
            className="mt-4 p-4 rounded-lg inline-block"
            style={{
              backgroundColor: THEME.colors.background.secondary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
          >
            <p
              className="font-semibold mb-1"
              style={{ color: THEME.colors.text.primary }}
            >
              {selectedTracking.orderNumber}
            </p>
            <p
              className="text-sm"
              style={{ color: THEME.colors.text.secondary }}
            >
              {selectedTracking.customerName}
            </p>
          </div>
        )}
        <p className="text-xs mt-4" style={{ color: THEME.colors.text.muted }}>
          Integrate Google Maps, Mapbox, or Leaflet here
        </p>
      </div>
    </div>
  );
};
