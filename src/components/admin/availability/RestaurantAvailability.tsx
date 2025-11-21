import React, { useState } from "react";
import { Save, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../../common/Button";
import { Badge } from "../../common/Badge";
import { AvailabilitySchedule } from "./AvailabilitySchedule";
import { THEME } from "../../../constants/theme";
import type { RestaurantAvailability as RestaurantAvailabilityType } from "../../../types";

// Mock data
const mockAvailability: RestaurantAvailabilityType[] = [
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

export const RestaurantAvailability: React.FC = () => {
  const [availability, setAvailability] =
    useState<RestaurantAvailabilityType[]>(mockAvailability);
  const [restaurantStatus, setRestaurantStatus] = useState<"open" | "closed">(
    "open"
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleDay = (dayId: string) => {
    setAvailability(
      availability.map((day) =>
        day.id === dayId ? { ...day, isOpen: !day.isOpen } : day
      )
    );
    setHasChanges(true);
  };

  const handleTimeChange = (
    dayId: string,
    field: "openTime" | "closeTime",
    value: string
  ) => {
    setAvailability(
      availability.map((day) =>
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
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

  return (
    <div className="space-y-6 h-full overflow-y-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: THEME.colors.text.primary }}
          >
            Restaurant Availability
          </h2>
          <p className="mt-1" style={{ color: THEME.colors.text.secondary }}>
            Manage your restaurant's operating hours
          </p>
        </div>
        {hasChanges && (
          <Button
            onClick={handleSaveChanges}
            icon={<Save className="w-5 h-5" />}
          >
            Save Changes
          </Button>
        )}
      </div>

      {/* Restaurant Status Card */}
      <div
        className="p-6 rounded-2xl border"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3
                className="text-lg font-semibold"
                style={{ color: THEME.colors.text.primary }}
              >
                Restaurant Status
              </h3>
              <Badge
                variant={restaurantStatus === "open" ? "success" : "error"}
                size="lg"
              >
                {restaurantStatus === "open" ? "OPEN" : "CLOSED"}
              </Badge>
            </div>
            <p
              className="text-sm"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Instantly open or close the restaurant for new orders
            </p>
          </div>
          <Button
            onClick={handleToggleRestaurant}
            variant={restaurantStatus === "open" ? "danger" : "success"}
            icon={
              restaurantStatus === "open" ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )
            }
            size="lg"
          >
            {restaurantStatus === "open"
              ? "Close Restaurant"
              : "Open Restaurant"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            >
              <Clock className="w-6 h-6" style={{ color: "#3b82f6" }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {currentlyOpen}/7
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Days Open
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
            >
              <Clock className="w-6 h-6" style={{ color: "#10b981" }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {availability.find((d) => d.dayOfWeek === "Monday")?.openTime ||
                  "N/A"}
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Typical Opening
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
            >
              <Clock className="w-6 h-6" style={{ color: "#8b5cf6" }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {availability.find((d) => d.dayOfWeek === "Monday")
                  ?.closeTime || "N/A"}
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Typical Closing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: THEME.colors.border.DEFAULT }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: THEME.colors.text.primary }}
          >
            Weekly Operating Hours
          </h3>
          <p
            className="text-sm mt-1"
            style={{ color: THEME.colors.text.tertiary }}
          >
            Set your restaurant's hours for each day of the week
          </p>
        </div>
        <div className="p-6">
          <AvailabilitySchedule
            availability={availability}
            onToggleDay={handleToggleDay}
            onTimeChange={handleTimeChange}
          />
        </div>
      </div>

      {/* Special Hours Notice */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderWidth: "1px",
            borderColor: "rgba(245, 158, 11, 0.3)",
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{ color: THEME.colors.text.primary }}
          >
            Special Hours & Holidays
          </h4>
          <p className="text-sm" style={{ color: THEME.colors.text.secondary }}>
            For special events, holidays, or temporary closures, you can
            override the regular schedule. Contact support to set up special
            hours.
          </p>
        </div>
      </div>
    </div>
  );
};
