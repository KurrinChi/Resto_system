// Theme colors - Deep Maroon Theme
export const THEME = {
    colors: {
        primary: {
            DEFAULT: "#8B0000",
            light: "#A52A2A",
            dark: "#5C0000",
        },
        background: {
            primary: "#0a0404",
            secondary: "#1a0f0f",
            tertiary: "#2a1515",
            hover: "#3a1a1a",
        },
        text: {
            primary: "#f5e6e6",
            secondary: "#d4b8b8",
            tertiary: "#a88585",
            muted: "#8a6868",
        },
        border: {
            DEFAULT: "#4d2929",
            light: "#5d3434",
            dark: "#3d1f1f",
        },
        status: {
            success: "#10b981",
            warning: "#f59e0b",
            error: "#ef4444",
            info: "#3b82f6",
        },
    },
};
export const getThemeMode = () => {
    if (typeof window === "undefined")
        return "dark";
    return localStorage.getItem("themeMode") || "dark";
};
export const setThemeMode = (mode) => {
    if (typeof window === "undefined")
        return;
    localStorage.setItem("themeMode", mode);
    applyThemeMode(mode);
};
export const applyThemeMode = (mode) => {
    if (typeof window === "undefined")
        return;
    const isDark = mode === "dark" ||
        (mode === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
};
export const initializeTheme = () => {
    const mode = getThemeMode();
    applyThemeMode(mode);
};
