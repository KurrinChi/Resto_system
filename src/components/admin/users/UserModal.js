import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { THEME } from "../../../constants/theme";
export const UserModal = ({ isOpen, onClose, onSave, user, }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "customer",
        status: "active",
        phone: "",
    });
    useEffect(() => {
        if (user) {
            setFormData(user);
        }
        else {
            setFormData({
                name: "",
                email: "",
                role: "customer",
                status: "active",
                phone: "",
            });
        }
    }, [user, isOpen]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: user?.id || "",
            dateJoined: user?.dateJoined || new Date().toISOString().split("T")[0],
        });
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: user ? "Edit User" : "Add New User", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "secondary", onClick: onClose, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, children: user ? "Save Changes" : "Add User" })] }), children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { label: "Full Name", placeholder: "Enter full name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true }), _jsx(Input, { label: "Email Address", type: "email", placeholder: "Enter email address", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true }), _jsx(Input, { label: "Phone Number", type: "tel", placeholder: "Enter phone number", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: "Role" }), _jsxs("select", { value: formData.role, onChange: (e) => setFormData({ ...formData, role: e.target.value }), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                backgroundColor: THEME.colors.background.tertiary,
                                color: THEME.colors.text.primary,
                                borderWidth: "1px",
                                borderColor: THEME.colors.border.DEFAULT,
                            }, required: true, children: [_jsx("option", { value: "customer", children: "Customer" }), _jsx("option", { value: "staff", children: "Staff" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: THEME.colors.text.primary }, children: "Status" }), _jsxs("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                backgroundColor: THEME.colors.background.tertiary,
                                color: THEME.colors.text.primary,
                                borderWidth: "1px",
                                borderColor: THEME.colors.border.DEFAULT,
                            }, required: true, children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "suspended", children: "Suspended" })] })] })] }) }));
};
