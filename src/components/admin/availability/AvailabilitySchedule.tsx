import React from "react";
import type { RestaurantAvailability } from "../../../types";
import { Badge } from "../../common/Badge";
import { THEME } from "../../../constants/theme";

interface AvailabilityScheduleProps {
  availability: RestaurantAvailability[];
  onToggleDay: (dayId: string) => void;
  onTimeChange: (
    dayId: string,
    field: "openTime" | "closeTime",
    value: string
  ) => void;
}

export const AvailabilitySchedule: React.FC<AvailabilityScheduleProps> = ({
  availability,
  onToggleDay,
  onTimeChange,
}) => {
  return (
    <div className="space-y-3">
      {availability.map((day) => (
        <div
          key={day.id}
          className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border transition-all"
          style={{
            backgroundColor: day.isOpen
              ? THEME.colors.background.secondary
              : THEME.colors.background.tertiary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          {/* Day Name and Toggle */}
          <div className="flex items-center justify-between md:w-48">
            <span
              className="font-medium"
              style={{ color: THEME.colors.text.primary }}
            >
              {day.dayOfWeek}
            </span>
            <button onClick={() => onToggleDay(day.id)} className="md:hidden">
              <Badge variant={day.isOpen ? "success" : "error"}>
                {day.isOpen ? "Open" : "Closed"}
              </Badge>
            </button>
          </div>

          {/* Time Inputs */}
          {day.isOpen ? (
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: THEME.colors.text.tertiary }}
                >
                  Opening Time
                </label>
                <input
                  type="time"
                  value={day.openTime}
                  onChange={(e) =>
                    onTimeChange(day.id, "openTime", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: THEME.colors.background.tertiary,
                    color: THEME.colors.text.primary,
                    borderWidth: "1px",
                    borderColor: THEME.colors.border.DEFAULT,
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: THEME.colors.text.tertiary }}
                >
                  Closing Time
                </label>
                <input
                  type="time"
                  value={day.closeTime}
                  onChange={(e) =>
                    onTimeChange(day.id, "closeTime", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: THEME.colors.background.tertiary,
                    color: THEME.colors.text.primary,
                    borderWidth: "1px",
                    borderColor: THEME.colors.border.DEFAULT,
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              className="flex-1 flex items-center"
              style={{ color: THEME.colors.text.muted }}
            >
              <p className="text-sm">Closed all day</p>
            </div>
          )}

          {/* Status Badge (Desktop) */}
          <div className="hidden md:flex md:w-32 md:justify-end">
            <button onClick={() => onToggleDay(day.id)}>
              <Badge variant={day.isOpen ? "success" : "error"} size="lg">
                {day.isOpen ? "Open" : "Closed"}
              </Badge>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
