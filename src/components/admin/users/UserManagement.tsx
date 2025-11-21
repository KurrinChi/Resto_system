import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../common/Button";
import { SearchBar } from "../../common/SearchBar";
import { UserTable } from "./UserTable";
import { UserModal } from "./UserModal";
import { THEME } from "../../../constants/theme";
import type { User } from "../../../types";
import { usersApi } from "../../../services/apiservice";

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll();
      console.log('Users API Response:', response);
      
      if (response.success) {
        // Transform Firebase data to match User interface
        const usersData = response.data.map((user: any) => {
          console.log('User data:', user);
          return {
            id: user.id,
            name: user.fullName || user.full_name || user.username || user.email?.split('@')[0] || 'Unknown',
            email: user.email || '',
            role: (user.role || 'customer').toLowerCase(),
            status: (user.status || 'active').toLowerCase(),
            phone: user.phoneNumber || user.phone || '',
            dateJoined: user.createdAt || user.created_at || new Date().toISOString().split('T')[0],
            avatar: user.avatar || user.avatar_url || ''
          };
        });
        console.log('Transformed users:', usersData);
        setUsers(usersData);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      alert('Error loading users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await usersApi.delete(userId);
        if (response.success) {
          setUsers(users.filter((user) => user.id !== userId));
        }
      } catch (err: any) {
        alert('Error deleting user: ' + err.message);
      }
    }
  };

  const handleSaveUser = async (user: User) => {
    try {
      // Transform data to match backend schema
      const userData = {
        fullName: user.name,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phone || '',
        phone: user.phone || '',
        status: user.status,
        avatar: user.avatar || ''
      };

      if (selectedUser) {
        // Edit existing user
        const response = await usersApi.update(user.id, userData);
        if (response.success) {
          await fetchUsers(); // Reload users to get updated data
        }
      } else {
        // Add new user (needs password for creation)
        const newUserData = {
          ...userData,
          password: 'temp123' // Default password, user should change it
        };
        const response = await usersApi.create(newUserData);
        if (response.success) {
          await fetchUsers(); // Reload users to get new data
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving user:', err);
      alert('Error saving user: ' + (err.response?.data?.error || err.message));
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Page Header - Fixed Height */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: THEME.colors.text.primary }}
          >
            User Management
          </h2>
          <p className="mt-1" style={{ color: THEME.colors.text.secondary }}>
            Manage your users and their permissions
          </p>
        </div>
        <Button onClick={handleAddUser} icon={<Plus className="w-5 h-5" />}>
          Add User
        </Button>
      </div>

      {/* Filters and Search - Fixed Height */}
      <div
        className="p-4 rounded-2xl border flex-shrink-0"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search users..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table - Flexible Height */}
      <div
        className="rounded-2xl border overflow-hidden flex-1 flex flex-col"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
};
