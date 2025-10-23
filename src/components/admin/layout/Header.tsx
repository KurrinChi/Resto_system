import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAdmin } from "../../../contexts/AdminContext";
import { THEME } from "../../../constants/theme";
import { Avatar } from "../../common/Avatar";

// Map routes to page titles
const routeTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/menu": "Menu",
  "/admin/orders": "Orders",
  "/admin/tracking": "Tracking",
  "/admin/availability": "Availability",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

export const Header: React.FC = () => {
  const { setMobileMenuOpen, adminUser } = useAdmin();
  const [searchValue, setSearchValue] = React.useState("");
  const location = useLocation();

  // Get current page title from route
  const currentPage = routeTitles[location.pathname] || "Dashboard";

  return (
    <header
      className="h-12 sticky top-0 z-20 p-5"
      style={{
        backgroundColor: THEME.colors.background.primary,
        borderBottom: `1px solid ${THEME.colors.border.dark}`,
      }}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: THEME.colors.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                THEME.colors.background.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Page Title - Auto Updates */}
          <h2
            className="text-sm font-semibold"
            style={{ color: THEME.colors.text.primary }}
          >
            {currentPage}
          </h2>
        </div>

        {/* Right Section - Minimal Icons */}
        <div className="flex items-center gap-2">
          {/* Search Bar - Minimal */}
          <div
            className="hidden md:flex items-center rounded-lg px-3 h-8 w-56 transition-all"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${THEME.colors.border.dark}`,
            }}
          >
            <Search
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: THEME.colors.text.tertiary }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="ml-2 bg-transparent border-none outline-none text-xs w-full"
              style={{ color: THEME.colors.text.primary }}
            />
          </div>

          {/* User Avatar - Static (No Hover) */}
          <div className="flex items-center gap-2 px-1.5 h-8">
            <Avatar src={adminUser?.avatar} name={adminUser?.name} size="sm" />
            <span
              className="hidden lg:block text-xs font-medium"
              style={{ color: THEME.colors.text.primary }}
            >
              {adminUser?.name?.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
