import React, { useState } from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { User } from "../../../types";
import { Badge } from "../../common/Badge";
import { Avatar } from "../../common/Avatar";
import { THEME } from "../../../constants/theme";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusVariant = (
    status: string
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  const getRoleBadgeVariant = (
    role: string
  ): "info" | "success" | "warning" | "default" => {
    switch (role) {
      case "admin":
        return "info";
      case "manager":
        return "success";
      case "staff":
        return "warning";
      default:
        return "default";
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (users.length === 0) {
    return (
      <div
        className="flex items-center justify-center flex-1"
        style={{ color: THEME.colors.text.tertiary }}
      >
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No users found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Table Container - Takes remaining space */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                borderBottom: `2px solid ${THEME.colors.border.light}`,
              }}
            >
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                User
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Role
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Phone
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Date Joined
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className="transition-all duration-200"
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? THEME.colors.background.secondary
                      : THEME.colors.background.tertiary,
                  borderBottom: `1px solid ${THEME.colors.border.dark}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    THEME.colors.background.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    index % 2 === 0
                      ? THEME.colors.background.secondary
                      : THEME.colors.background.tertiary;
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} name={user.name} size="md" />
                    <div>
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: THEME.colors.text.primary }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: THEME.colors.text.tertiary }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {user.phone || (
                    <span style={{ color: THEME.colors.text.muted }}>N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {new Date(user.dateJoined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-lg transition-all border"
                      style={{
                        color: THEME.colors.text.secondary,
                        backgroundColor: "transparent",
                        borderColor: THEME.colors.border.DEFAULT,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(59, 130, 246, 0.1)";
                        e.currentTarget.style.color = "#3b82f6";
                        e.currentTarget.style.borderColor = "#3b82f6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color =
                          THEME.colors.text.secondary;
                        e.currentTarget.style.borderColor =
                          THEME.colors.border.DEFAULT;
                      }}
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 rounded-lg transition-all border"
                      style={{
                        color: THEME.colors.text.secondary,
                        backgroundColor: "transparent",
                        borderColor: THEME.colors.border.DEFAULT,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(239, 68, 68, 0.1)";
                        e.currentTarget.style.color = "#ef4444";
                        e.currentTarget.style.borderColor = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color =
                          THEME.colors.text.secondary;
                        e.currentTarget.style.borderColor =
                          THEME.colors.border.DEFAULT;
                      }}
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div
        className="flex items-center justify-between px-6 py-3 border-t flex-shrink-0"
        style={{
          backgroundColor: THEME.colors.background.tertiary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm" style={{ color: THEME.colors.text.secondary }}>
            Showing{" "}
            <span style={{ color: THEME.colors.text.primary, fontWeight: 600 }}>
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span style={{ color: THEME.colors.text.primary, fontWeight: 600 }}>
              {Math.min(endIndex, users.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: THEME.colors.text.primary, fontWeight: 600 }}>
              {users.length}
            </span>{" "}
            users
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: THEME.colors.background.secondary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor =
                  THEME.colors.background.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                THEME.colors.background.secondary;
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return page;
            }).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    page === currentPage
                      ? THEME.colors.primary.DEFAULT
                      : THEME.colors.background.secondary,
                  color:
                    page === currentPage
                      ? THEME.colors.text.primary
                      : THEME.colors.text.secondary,
                  borderWidth: "1px",
                  borderColor:
                    page === currentPage
                      ? "transparent"
                      : THEME.colors.border.DEFAULT,
                }}
                onMouseEnter={(e) => {
                  if (page !== currentPage) {
                    e.currentTarget.style.backgroundColor =
                      THEME.colors.background.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== currentPage) {
                    e.currentTarget.style.backgroundColor =
                      THEME.colors.background.secondary;
                  }
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: THEME.colors.background.secondary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor =
                  THEME.colors.background.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                THEME.colors.background.secondary;
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
