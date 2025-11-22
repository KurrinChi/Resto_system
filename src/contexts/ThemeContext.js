import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { THEME as DEFAULT_THEME } from "../constants/theme";
import { BRANDING as DEFAULT_BRANDING } from "../constants/branding";
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children, }) => {
    // Load custom theme from localStorage
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("customTheme");
        return saved ? JSON.parse(saved) : DEFAULT_THEME;
    });
    // Load custom branding from localStorage
    const [branding, setBranding] = useState(() => {
        const saved = localStorage.getItem("customBranding");
        return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
    });
    // Apply CSS variables on mount and when theme changes
    useEffect(() => {
        applyThemeVariables(theme);
    }, [theme]);
    const applyThemeVariables = (themeConfig) => {
        const root = document.documentElement;
        // Primary colors
        root.style.setProperty("--color-primary", themeConfig.colors.primary.DEFAULT);
        root.style.setProperty("--color-primary-light", themeConfig.colors.primary.light);
        root.style.setProperty("--color-primary-dark", themeConfig.colors.primary.dark);
        // Background colors
        root.style.setProperty("--color-bg-primary", themeConfig.colors.background.primary);
        root.style.setProperty("--color-bg-secondary", themeConfig.colors.background.secondary);
        root.style.setProperty("--color-bg-tertiary", themeConfig.colors.background.tertiary);
        root.style.setProperty("--color-bg-hover", themeConfig.colors.background.hover);
        // Text colors
        root.style.setProperty("--color-text-primary", themeConfig.colors.text.primary);
        root.style.setProperty("--color-text-secondary", themeConfig.colors.text.secondary);
        root.style.setProperty("--color-text-tertiary", themeConfig.colors.text.tertiary);
        root.style.setProperty("--color-text-muted", themeConfig.colors.text.muted);
        // Border colors
        root.style.setProperty("--color-border-default", themeConfig.colors.border.DEFAULT);
        root.style.setProperty("--color-border-light", themeConfig.colors.border.light);
        root.style.setProperty("--color-border-dark", themeConfig.colors.border.dark);
    };
    const updateTheme = (updates) => {
        const newTheme = {
            ...theme,
            colors: {
                ...theme.colors,
                ...updates,
            },
        };
        setTheme(newTheme);
        localStorage.setItem("customTheme", JSON.stringify(newTheme));
    };
    const updateBranding = (updates) => {
        const newBranding = {
            ...branding,
            ...updates,
        };
        setBranding(newBranding);
        localStorage.setItem("customBranding", JSON.stringify(newBranding));
    };
    const resetTheme = () => {
        setTheme(DEFAULT_THEME);
        setBranding(DEFAULT_BRANDING);
        localStorage.removeItem("customTheme");
        localStorage.removeItem("customBranding");
    };
    return (_jsx(ThemeContext.Provider, { value: { theme, branding, updateTheme, updateBranding, resetTheme }, children: children }));
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};
