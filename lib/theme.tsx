'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('bubble-chart-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem('bubble-chart-theme', theme);
    
    // Apply theme to document body
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme color constants
export const themeColors = {
  dark: {
    background: 'rgb(15, 15, 15)',
    backgroundEnd: 'rgb(25, 25, 25)',
    tileBackground: 'rgb(33, 33, 33)',
    bubbleBackground: 'rgb(45, 45, 45)',
    bubbleHover: 'rgb(55, 55, 55)',
    formBackground: 'rgb(45, 45, 45)',
    border: 'rgb(75, 85, 99)',
    text: 'rgb(243, 244, 246)',
    textSecondary: 'rgb(156, 163, 175)',
    textMuted: 'rgb(107, 114, 128)',
    scrollbarTrack: 'rgb(45, 45, 45)',
    scrollbarThumb: 'rgb(75, 85, 99)',
    exportBackground: 'rgb(15, 15, 15)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    strokeColor: 'rgba(255, 255, 255, 0.1)',
  },
  light: {
    background: 'rgb(248, 250, 252)',
    backgroundEnd: 'rgb(241, 245, 249)',
    tileBackground: 'rgb(255, 255, 255)',
    bubbleBackground: 'rgb(248, 250, 252)',
    bubbleHover: 'rgb(241, 245, 249)',
    formBackground: 'rgb(248, 250, 252)',
    border: 'rgb(203, 213, 225)',
    text: 'rgb(15, 23, 42)',
    textSecondary: 'rgb(71, 85, 105)',
    textMuted: 'rgb(100, 116, 139)',
    scrollbarTrack: 'rgb(241, 245, 249)',
    scrollbarThumb: 'rgb(203, 213, 225)',
    exportBackground: 'rgb(248, 250, 252)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    strokeColor: 'rgba(0, 0, 0, 0.05)',
  }
};
