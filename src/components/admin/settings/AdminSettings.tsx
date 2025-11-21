import React, { useState } from "react";
import {
  Save,
  Bell,
  Lock,
  Palette,
  Globe,
  Mail,
  RotateCcw,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { SettingsForm } from "./SettingsForm";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  getThemeMode,
  setThemeMode,
  type ThemeMode,
} from "../../../constants/theme";
import { getLightVariant, getDarkVariant } from "../../../utils/colorUtils";

export const AdminSettings: React.FC = () => {
  const { theme, branding, updateTheme, updateBranding, resetTheme } =
    useTheme();

  const [activeTab, setActiveTab] = useState<
    "general" | "notifications" | "security" | "appearance"
  >("general");

  // Load from localStorage
  const loadSettings = () => {
    const saved = localStorage.getItem("restaurantSettings");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      restaurantName: branding.appName,
      contactEmail: branding.company.email,
      phoneNumber: branding.company.phone,
      address: "",
      timezone: "UTC-08:00",
      logoUrl: branding.logo.url,
      primaryColor: theme.colors.primary.DEFAULT,
      themeMode: getThemeMode(),
      newOrderNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      dailyReports: true,
    };
  };

  const savedSettings = loadSettings();

  // Settings state
  const [restaurantName, setRestaurantName] = useState<string>(
    savedSettings.restaurantName
  );
  const [contactEmail, setContactEmail] = useState<string>(
    savedSettings.contactEmail
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    savedSettings.phoneNumber
  );
  const [address, setAddress] = useState<string>(savedSettings.address);
  const [timezone, setTimezone] = useState<string>(savedSettings.timezone);
  const [logoUrl, setLogoUrl] = useState<string>(savedSettings.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(savedSettings.primaryColor);
  const [themeModeState, setThemeModeState] = useState<ThemeMode>(
    savedSettings.themeMode
  );
  const [newOrderNotifications, setNewOrderNotifications] = useState(
    savedSettings.newOrderNotifications
  );
  const [emailNotifications, setEmailNotifications] = useState(
    savedSettings.emailNotifications
  );
  const [smsNotifications, setSmsNotifications] = useState(
    savedSettings.smsNotifications
  );
  const [dailyReports, setDailyReports] = useState(savedSettings.dailyReports);

  const [hasChanges, setHasChanges] = useState(false);

  // Apply color changes immediately
  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    setHasChanges(true);

    // Apply immediately
    updateTheme({
      primary: {
        DEFAULT: color,
        light: getLightVariant(color),
        dark: getDarkVariant(color),
      },
    });
  };

  const handleSaveSettings = () => {
    const settings = {
      restaurantName,
      contactEmail,
      phoneNumber,
      address,
      timezone,
      logoUrl,
      primaryColor,
      themeMode: themeModeState,
      newOrderNotifications,
      emailNotifications,
      smsNotifications,
      dailyReports,
    };

    // Save to localStorage
    localStorage.setItem("restaurantSettings", JSON.stringify(settings));

    // Update branding
    updateBranding({
      appName: restaurantName,
      company: {
        name: restaurantName,
        email: contactEmail,
        phone: phoneNumber,
      },
      logo: {
        ...branding.logo,
        url: logoUrl,
      },
    });

    // Apply theme mode
    setThemeMode(themeModeState);

    alert("Settings saved successfully!");
    setHasChanges(false);
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset all settings to default? This cannot be undone.")) {
      resetTheme();
      localStorage.removeItem("restaurantSettings");
      window.location.reload();
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <Globe className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6 h-full overflow-y-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            Admin Settings
          </h2>
          <p className="mt-1" style={{ color: theme.colors.text.secondary }}>
            Manage your restaurant and account settings
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button
              onClick={handleSaveSettings}
              icon={<Save className="w-5 h-5" />}
            >
              Save Changes
            </Button>
          )}
          <Button
            onClick={handleResetToDefaults}
            variant="secondary"
            icon={<RotateCcw className="w-5 h-5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.border.DEFAULT,
        }}
      >
        <div
          className="border-b"
          style={{ borderColor: theme.colors.border.DEFAULT }}
        >
          <nav className="flex flex-wrap gap-2 px-6 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor:
                    activeTab === tab.id
                      ? theme.colors.primary.DEFAULT
                      : "transparent",
                  color:
                    activeTab === tab.id
                      ? theme.colors.text.primary
                      : theme.colors.text.secondary,
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.background.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <SettingsForm title="General Settings">
              <div className="space-y-4">
                <Input
                  label="Restaurant Name"
                  placeholder="Enter restaurant name"
                  value={restaurantName}
                  onChange={(e) => {
                    setRestaurantName(e.target.value);
                    setHasChanges(true);
                  }}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  placeholder="Enter contact email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    setHasChanges(true);
                  }}
                  icon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setHasChanges(true);
                  }}
                />
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Restaurant Address
                  </label>
                  <textarea
                    placeholder="Enter full address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: theme.colors.background.tertiary,
                      color: theme.colors.text.primary,
                      borderWidth: "1px",
                      borderColor: theme.colors.border.DEFAULT,
                    }}
                    rows={3}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Time Zone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => {
                      setTimezone(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: theme.colors.background.tertiary,
                      color: theme.colors.text.primary,
                      borderWidth: "1px",
                      borderColor: theme.colors.border.DEFAULT,
                    }}
                  >
                    <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                    <option value="UTC-06:00">UTC-06:00 (Central Time)</option>
                    <option value="UTC-07:00">UTC-07:00 (Mountain Time)</option>
                    <option value="UTC-08:00">UTC-08:00 (Pacific Time)</option>
                  </select>
                </div>
              </div>
            </SettingsForm>
          )}

          {activeTab === "notifications" && (
            <SettingsForm title="Notification Preferences">
              <div className="space-y-4">
                {[
                  {
                    state: newOrderNotifications,
                    setter: setNewOrderNotifications,
                    title: "New Order Notifications",
                    desc: "Get notified when new orders arrive",
                  },
                  {
                    state: emailNotifications,
                    setter: setEmailNotifications,
                    title: "Email Notifications",
                    desc: "Receive email updates about orders",
                  },
                  {
                    state: smsNotifications,
                    setter: setSmsNotifications,
                    title: "SMS Notifications",
                    desc: "Get text messages for urgent updates",
                  },
                  {
                    state: dailyReports,
                    setter: setDailyReports,
                    title: "Daily Reports",
                    desc: "Receive daily performance reports",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                    style={{ borderColor: theme.colors.border.DEFAULT }}
                  >
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: theme.colors.text.tertiary }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => {
                          item.setter(e.target.checked);
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"
                        style={{
                          backgroundColor: theme.colors.background.tertiary,
                        }}
                      ></div>
                    </label>
                  </div>
                ))}
              </div>
            </SettingsForm>
          )}

          {activeTab === "security" && (
            <SettingsForm title="Security Settings">
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                />
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: theme.colors.border.DEFAULT }}
                >
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: theme.colors.text.primary }}
                      >
                        Two-Factor Authentication
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: theme.colors.text.tertiary }}
                      >
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </div>
            </SettingsForm>
          )}

          {activeTab === "appearance" && (
            <SettingsForm title="Appearance Settings">
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Logo URL
                  </label>
                  <Input
                    placeholder="Enter logo URL"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Primary Color (Changes Apply Instantly)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-10 w-20 rounded border cursor-pointer"
                      style={{ borderColor: theme.colors.border.DEFAULT }}
                    />
                    <Input
                      placeholder="#8B0000"
                      value={primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.colors.text.muted }}
                  >
                    Try changing the color and see it update live!
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Theme Mode
                  </label>
                  <select
                    value={themeModeState}
                    onChange={(e) => {
                      setThemeModeState(e.target.value as ThemeMode);
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: theme.colors.background.tertiary,
                      color: theme.colors.text.primary,
                      borderWidth: "1px",
                      borderColor: theme.colors.border.DEFAULT,
                    }}
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </SettingsForm>
          )}
        </div>
      </div>
    </div>
  );
};
