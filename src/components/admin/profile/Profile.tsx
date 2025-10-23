import React, { useState } from "react";
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Upload,
  Shield,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { THEME } from "../../../constants/theme";
import { Avatar } from "../../common/Avatar";

export const Profile: React.FC = () => {
  // Load from localStorage or use defaults
  const loadProfile = () => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: "Admin User",
      email: "admin@restaurant.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State 12345",
      bio: "Restaurant administrator with 5+ years of experience",
      role: "Administrator",
      avatar: "",
    };
  };

  const profile = loadProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [hasChanges, setHasChanges] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    const updatedProfile = {
      name,
      email,
      phone,
      address,
      bio,
      role: profile.role,
      avatar,
    };

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    alert("Profile updated successfully!");
    setHasChanges(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // TODO: Implement actual password change API call
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: THEME.colors.text.primary }}
          >
            My Profile
          </h2>
          <p className="mt-1" style={{ color: THEME.colors.text.secondary }}>
            Manage your personal information and account settings
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} icon={<Save className="w-5 h-5" />}>
            Save Changes
          </Button>
        )}
      </div>

      {/* Profile Picture Section */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar src={avatar} name={name} size="xl" />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full border-2 cursor-pointer transition-colors"
                style={{
                  backgroundColor: THEME.colors.background.secondary,
                  borderColor: THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    THEME.colors.primary.DEFAULT;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    THEME.colors.background.secondary;
                }}
              >
                <Camera className="w-5 h-5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3
                className="text-xl font-semibold"
                style={{ color: THEME.colors.text.primary }}
              >
                {name}
              </h3>
              <p
                className="text-sm mt-1 mb-4"
                style={{ color: THEME.colors.text.tertiary }}
              >
                {profile.role}
              </p>
              <label htmlFor="avatar-upload">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Upload className="w-4 h-4" />}
                >
                  Upload New Photo
                </Button>
              </label>
              <p
                className="text-xs mt-2"
                style={{ color: THEME.colors.text.muted }}
              >
                JPG, PNG or GIF. Max size 2MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: THEME.colors.border.DEFAULT }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: THEME.colors.text.primary }}
          >
            Personal Information
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setHasChanges(true);
            }}
            icon={<User className="w-5 h-5" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setHasChanges(true);
            }}
            icon={<Mail className="w-5 h-5" />}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setHasChanges(true);
            }}
            icon={<Phone className="w-5 h-5" />}
          />

          <Input
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setHasChanges(true);
            }}
            icon={<MapPin className="w-5 h-5" />}
          />

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: THEME.colors.text.primary }}
            >
              Bio
            </label>
            <textarea
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setHasChanges(true);
              }}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: THEME.colors.border.DEFAULT }}
        >
          <div className="flex items-center gap-2">
            <Shield
              className="w-5 h-5"
              style={{ color: THEME.colors.text.primary }}
            />
            <h3
              className="text-lg font-semibold"
              style={{ color: THEME.colors.text.primary }}
            >
              Account Security
            </h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            onClick={handlePasswordChange}
            variant="secondary"
            className="mt-4"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Activity Information */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: THEME.colors.border.DEFAULT }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: THEME.colors.text.primary }}
          >
            Activity Information
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p
                className="font-medium"
                style={{ color: THEME.colors.text.primary }}
              >
                Last Login
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                October 23, 2025 at 1:30 PM
              </p>
            </div>
          </div>

          <div
            className="flex items-center justify-between py-3 border-t"
            style={{ borderColor: THEME.colors.border.DEFAULT }}
          >
            <div>
              <p
                className="font-medium"
                style={{ color: THEME.colors.text.primary }}
              >
                Account Created
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                January 15, 2024
              </p>
            </div>
          </div>

          <div
            className="flex items-center justify-between py-3 border-t"
            style={{ borderColor: THEME.colors.border.DEFAULT }}
          >
            <div>
              <p
                className="font-medium"
                style={{ color: THEME.colors.text.primary }}
              >
                Account Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: THEME.colors.status.success }}
                />
                <p
                  className="text-sm"
                  style={{ color: THEME.colors.text.tertiary }}
                >
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
