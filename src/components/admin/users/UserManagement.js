import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../common/Button";
import { SearchBar } from "../../common/SearchBar";
import { UserTable } from "./UserTable";
import { UserModal } from "./UserModal";
import { THEME } from "../../../constants/theme";
import { usersApi } from "../../../services/apiservice";
export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
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
                const usersData = response.data.map((user) => {
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
        }
        catch (err) {
            console.error('Error fetching users:', err);
            alert('Error loading users: ' + err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await usersApi.delete(userId);
                if (response.success) {
                    setUsers(users.filter((user) => user.id !== userId));
                }
            }
            catch (err) {
                alert('Error deleting user: ' + err.message);
            }
        }
    };
    const handleSaveUser = async (user) => {
        try {
            // Transform data to match Firebase schema
            const userData = {
                username: user.email.split('@')[0],
                full_name: user.name,
                email: user.email,
                role: user.role.toUpperCase(),
                phone: user.phone || '',
                status: user.status.toUpperCase()
            };
            if (selectedUser) {
                // Edit existing user
                const response = await usersApi.update(user.id, userData);
                if (response.success) {
                    setUsers(users.map((u) => (u.id === user.id ? user : u)));
                }
            }
            else {
                // Add new user (needs password for creation)
                const newUserData = {
                    ...userData,
                    password: 'defaultPassword123' // Should prompt for password in modal
                };
                const response = await usersApi.create(newUserData);
                if (response.success) {
                    const newUser = { ...user, id: response.data.id };
                    setUsers([...users, newUser]);
                }
            }
            setIsModalOpen(false);
        }
        catch (err) {
            alert('Error saving user: ' + err.message);
        }
    };
    // Filter users based on search and filters
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });
    return (_jsxs("div", { className: "flex flex-col h-full space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "User Management" }), _jsx("p", { className: "mt-1", style: { color: THEME.colors.text.secondary }, children: "Manage your users and their permissions" })] }), _jsx(Button, { onClick: handleAddUser, icon: _jsx(Plus, { className: "w-5 h-5" }), children: "Add User" })] }), _jsx("div", { className: "p-4 rounded-2xl border flex-shrink-0", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "md:col-span-2", children: _jsx(SearchBar, { placeholder: "Search users...", value: searchQuery, onChange: setSearchQuery }) }), _jsx("div", { children: _jsxs("select", { value: filterRole, onChange: (e) => setFilterRole(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsx("option", { value: "all", children: "All Roles" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "manager", children: "Manager" }), _jsx("option", { value: "staff", children: "Staff" }), _jsx("option", { value: "customer", children: "Customer" })] }) }), _jsx("div", { children: _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "suspended", children: "Suspended" })] }) })] }) }), _jsx("div", { className: "rounded-2xl border overflow-hidden flex-1 flex flex-col", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsx(UserTable, { users: filteredUsers, onEdit: handleEditUser, onDelete: handleDeleteUser }) }), _jsx(UserModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSave: handleSaveUser, user: selectedUser })] }));
};
