import React from "react";
import { Calendar } from "lucide-react";
import { THEME } from "../../../constants/theme";

interface ReportFiltersProps {
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  reportType: string;
  onReportTypeChange: (type: string) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  reportType,
  onReportTypeChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: THEME.colors.text.primary }}
        >
          <Calendar className="w-4 h-4 inline mr-1" />
          Start Date
        </label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            onDateRangeChange({ ...dateRange, start: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
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
          className="block text-sm font-medium mb-1"
          style={{ color: THEME.colors.text.primary }}
        >
          <Calendar className="w-4 h-4 inline mr-1" />
          End Date
        </label>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) =>
            onDateRangeChange({ ...dateRange, end: e.target.value })
          }
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
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
          className="block text-sm font-medium mb-1"
          style={{ color: THEME.colors.text.primary }}
        >
          Report Type
        </label>
        <select
          value={reportType}
          onChange={(e) => onReportTypeChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: THEME.colors.background.tertiary,
            color: THEME.colors.text.primary,
            borderWidth: "1px",
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <option value="sales">Sales Report</option>
          <option value="orders">Orders Report</option>
          <option value="customers">Customers Report</option>
          <option value="inventory">Inventory Report</option>
        </select>
      </div>
    </div>
  );
};
