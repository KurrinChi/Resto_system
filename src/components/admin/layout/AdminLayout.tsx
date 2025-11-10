import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAdmin } from "../../../contexts/AdminContext";
import { THEME } from "../../../constants/theme";

export const AdminLayout: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useAdmin();

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: THEME.colors.background.primary }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Wrapper - Takes remaining width */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8"
          style={{ backgroundColor: THEME.colors.background.primary }}
        >
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
