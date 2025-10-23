import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/admin/layout/AdminLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initializeTheme } from "./constants/theme";

// Import all admin pages
import { Dashboard } from "./components/admin/dashboard/Dashboard.tsx";
import { UserManagement } from "./components/admin/users/UserManagement.tsx";
import { MenuItemManagement } from "./components/admin/menu/MenuItemManagement.tsx";
import { OrderManagement } from "./components/admin/orders/OrderManagement.tsx";
import { CustomerTracking } from "./components/admin/tracking/CustomerTracking.tsx";
import { RestaurantAvailability } from "./components/admin/availability/RestaurantAvailability.tsx";
import { ReportsAnalytics } from "./components/admin/reports/ReportsAnalytics.tsx";
import { AdminSettings } from "./components/admin/settings/AdminSettings.tsx";
import { Profile } from "./components/admin/profile/Profile.tsx";

// Initialize theme on app load
initializeTheme();

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="menu" element={<MenuItemManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="tracking" element={<CustomerTracking />} />
          <Route path="availability" element={<RestaurantAvailability />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

// 404 Not Found Component with Dark Theme
const NotFound: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0a0404" }}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold" style={{ color: "#f5e6e6" }}>
          404
        </h1>
        <p className="text-xl mt-4" style={{ color: "#d4b8b8" }}>
          Page not found
        </p>
        <a
          href="/admin/dashboard"
          className="mt-6 inline-block px-6 py-3 rounded-lg transition-colors"
          style={{
            backgroundColor: "#8B0000",
            color: "#f5e6e6",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#A52A2A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#8B0000";
          }}
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default App;
