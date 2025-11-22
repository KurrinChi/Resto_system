import React, { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { THEME } from "../../../constants/theme";
import type { User } from "../../../types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "CUSTOMER",
    status: "active",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: "",
        email: "",
        role: "CUSTOMER",
        status: "active",
        phone: "",
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: user?.id || "",
      dateJoined: user?.dateJoined || new Date().toISOString().split("T")[0],
    } as User);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Add New User"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {user ? "Save Changes" : "Add User"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as any })
            }
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: THEME.colors.background.tertiary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
            required
          >
            <option value="CUSTOMER">Customer</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as any })
            }
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: THEME.colors.background.tertiary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
            required
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};
