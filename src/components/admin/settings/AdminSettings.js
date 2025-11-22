import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Save, Bell, Lock, Palette, Globe, Mail, RotateCcw, } from "lucide-react";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { SettingsForm } from "./SettingsForm";
import { useTheme } from "../../../contexts/ThemeContext";
import { getThemeMode, setThemeMode, } from "../../../constants/theme";
import { getLightVariant, getDarkVariant } from "../../../utils/colorUtils";
export const AdminSettings = () => {
    const { theme, branding, updateTheme, updateBranding, resetTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("general");
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
    const [restaurantName, setRestaurantName] = useState(savedSettings.restaurantName);
    const [contactEmail, setContactEmail] = useState(savedSettings.contactEmail);
    const [phoneNumber, setPhoneNumber] = useState(savedSettings.phoneNumber);
    const [address, setAddress] = useState(savedSettings.address);
    const [timezone, setTimezone] = useState(savedSettings.timezone);
    const [logoUrl, setLogoUrl] = useState(savedSettings.logoUrl);
    const [primaryColor, setPrimaryColor] = useState(savedSettings.primaryColor);
    const [themeModeState, setThemeModeState] = useState(savedSettings.themeMode);
    const [newOrderNotifications, setNewOrderNotifications] = useState(savedSettings.newOrderNotifications);
    const [emailNotifications, setEmailNotifications] = useState(savedSettings.emailNotifications);
    const [smsNotifications, setSmsNotifications] = useState(savedSettings.smsNotifications);
    const [dailyReports, setDailyReports] = useState(savedSettings.dailyReports);
    const [hasChanges, setHasChanges] = useState(false);
    // Apply color changes immediately
    const handleColorChange = (color) => {
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
        { id: "general", label: "General", icon: _jsx(Globe, { className: "w-4 h-4" }) },
        {
            id: "notifications",
            label: "Notifications",
            icon: _jsx(Bell, { className: "w-4 h-4" }),
        },
        { id: "security", label: "Security", icon: _jsx(Lock, { className: "w-4 h-4" }) },
        {
            id: "appearance",
            label: "Appearance",
            icon: _jsx(Palette, { className: "w-4 h-4" }),
        },
    ];
    return (_jsxs("div", { className: "space-y-6 h-full overflow-y-auto pb-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: theme.colors.text.primary }, children: "Admin Settings" }), _jsx("p", { className: "mt-1", style: { color: theme.colors.text.secondary }, children: "Manage your restaurant and account settings" })] }), _jsxs("div", { className: "flex gap-2", children: [hasChanges && (_jsx(Button, { onClick: handleSaveSettings, icon: _jsx(Save, { className: "w-5 h-5" }), children: "Save Changes" })), _jsx(Button, { onClick: handleResetToDefaults, variant: "secondary", icon: _jsx(RotateCcw, { className: "w-5 h-5" }), children: "Reset" })] })] }), _jsxs("div", { className: "rounded-2xl border overflow-hidden", style: {
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: theme.colors.border.DEFAULT,
                }, children: [_jsx("div", { className: "border-b", style: { borderColor: theme.colors.border.DEFAULT }, children: _jsx("nav", { className: "flex flex-wrap gap-2 px-6 py-4", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", style: {
                                    backgroundColor: activeTab === tab.id
                                        ? theme.colors.primary.DEFAULT
                                        : "transparent",
                                    color: activeTab === tab.id
                                        ? theme.colors.text.primary
                                        : theme.colors.text.secondary,
                                }, onMouseEnter: (e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.backgroundColor =
                                            theme.colors.background.hover;
                                    }
                                }, onMouseLeave: (e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
                                }, children: [tab.icon, tab.label] }, tab.id))) }) }), _jsxs("div", { className: "p-6", children: [activeTab === "general" && (_jsx(SettingsForm, { title: "General Settings", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Restaurant Name", placeholder: "Enter restaurant name", value: restaurantName, onChange: (e) => {
                                                setRestaurantName(e.target.value);
                                                setHasChanges(true);
                                            } }), _jsx(Input, { label: "Contact Email", type: "email", placeholder: "Enter contact email", value: contactEmail, onChange: (e) => {
                                                setContactEmail(e.target.value);
                                                setHasChanges(true);
                                            }, icon: _jsx(Mail, { className: "w-5 h-5" }) }), _jsx(Input, { label: "Phone Number", type: "tel", placeholder: "Enter phone number", value: phoneNumber, onChange: (e) => {
                                                setPhoneNumber(e.target.value);
                                                setHasChanges(true);
                                            } }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: theme.colors.text.primary }, children: "Restaurant Address" }), _jsx("textarea", { placeholder: "Enter full address", value: address, onChange: (e) => {
                                                        setAddress(e.target.value);
                                                        setHasChanges(true);
                                                    }, className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                                        backgroundColor: theme.colors.background.tertiary,
                                                        color: theme.colors.text.primary,
                                                        borderWidth: "1px",
                                                        borderColor: theme.colors.border.DEFAULT,
                                                    }, rows: 3 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: theme.colors.text.primary }, children: "Time Zone" }), _jsxs("select", { value: timezone, onChange: (e) => {
                                                        setTimezone(e.target.value);
                                                        setHasChanges(true);
                                                    }, className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                                        backgroundColor: theme.colors.background.tertiary,
                                                        color: theme.colors.text.primary,
                                                        borderWidth: "1px",
                                                        borderColor: theme.colors.border.DEFAULT,
                                                    }, children: [_jsx("option", { value: "UTC-05:00", children: "UTC-05:00 (Eastern Time)" }), _jsx("option", { value: "UTC-06:00", children: "UTC-06:00 (Central Time)" }), _jsx("option", { value: "UTC-07:00", children: "UTC-07:00 (Mountain Time)" }), _jsx("option", { value: "UTC-08:00", children: "UTC-08:00 (Pacific Time)" })] })] })] }) })), activeTab === "notifications" && (_jsx(SettingsForm, { title: "Notification Preferences", children: _jsx("div", { className: "space-y-4", children: [
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
                                    ].map((item, idx) => (_jsxs("div", { className: "flex items-center justify-between py-3 border-b last:border-0", style: { borderColor: theme.colors.border.DEFAULT }, children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", style: { color: theme.colors.text.primary }, children: item.title }), _jsx("p", { className: "text-sm", style: { color: theme.colors.text.tertiary }, children: item.desc })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: item.state, onChange: (e) => {
                                                            item.setter(e.target.checked);
                                                            setHasChanges(true);
                                                        }, className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full", style: {
                                                            backgroundColor: theme.colors.background.tertiary,
                                                        } })] })] }, idx))) }) })), activeTab === "security" && (_jsx(SettingsForm, { title: "Security Settings", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Current Password", type: "password", placeholder: "Enter current password" }), _jsx(Input, { label: "New Password", type: "password", placeholder: "Enter new password" }), _jsx(Input, { label: "Confirm New Password", type: "password", placeholder: "Confirm new password" }), _jsx("div", { className: "pt-4 border-t", style: { borderColor: theme.colors.border.DEFAULT }, children: _jsxs("div", { className: "flex items-center justify-between py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", style: { color: theme.colors.text.primary }, children: "Two-Factor Authentication" }), _jsx("p", { className: "text-sm", style: { color: theme.colors.text.tertiary }, children: "Add an extra layer of security" })] }), _jsx(Button, { variant: "secondary", size: "sm", children: "Enable 2FA" })] }) })] }) })), activeTab === "appearance" && (_jsx(SettingsForm, { title: "Appearance Settings", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: theme.colors.text.primary }, children: "Logo URL" }), _jsx(Input, { placeholder: "Enter logo URL", value: logoUrl, onChange: (e) => {
                                                        setLogoUrl(e.target.value);
                                                        setHasChanges(true);
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: theme.colors.text.primary }, children: "Primary Color (Changes Apply Instantly)" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "color", value: primaryColor, onChange: (e) => handleColorChange(e.target.value), className: "h-10 w-20 rounded border cursor-pointer", style: { borderColor: theme.colors.border.DEFAULT } }), _jsx(Input, { placeholder: "#8B0000", value: primaryColor, onChange: (e) => handleColorChange(e.target.value), className: "flex-1" })] }), _jsx("p", { className: "text-xs mt-1", style: { color: theme.colors.text.muted }, children: "Try changing the color and see it update live!" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", style: { color: theme.colors.text.primary }, children: "Theme Mode" }), _jsxs("select", { value: themeModeState, onChange: (e) => {
                                                        setThemeModeState(e.target.value);
                                                        setHasChanges(true);
                                                    }, className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                                        backgroundColor: theme.colors.background.tertiary,
                                                        color: theme.colors.text.primary,
                                                        borderWidth: "1px",
                                                        borderColor: theme.colors.border.DEFAULT,
                                                    }, children: [_jsx("option", { value: "light", children: "Light Mode" }), _jsx("option", { value: "dark", children: "Dark Mode" }), _jsx("option", { value: "system", children: "System Default" })] })] })] }) }))] })] })] }));
};
