// Light theme for client-facing components (sidebar remains dark)
export const CLIENT_THEME = {
  colors: {
    primary: {
      DEFAULT: '#8B0000',
      light: '#A52A2A',
      dark: '#5C0000',
    },
    background: {
      primary: '#ffffff', // swapped to light
      secondary: '#f8f8f8',
      tertiary: '#f0f0f0',
      hover: '#f5f5f5',
    },
    text: {
      primary: '#2b2b2bff', // swapped to dark text
      secondary: '#4b4b4b',
      tertiary: '#6b6b6b',
      muted: '#8a6868',
    },
    border: {
      DEFAULT: '#e5e5e5',
      light: '#dddddd',
      dark: '#cccccc',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
};

export type ClientTheme = typeof CLIENT_THEME;
