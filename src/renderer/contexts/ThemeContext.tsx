import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, ThemeName } from '../themes/types';
import { themes } from '../themes/themes';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('markdownViewerTheme');
    return (savedTheme as ThemeName) || 'dark';
  });

  const theme = themes[themeName];
  const availableThemes = Object.keys(themes) as ThemeName[];

  useEffect(() => {
    localStorage.setItem('markdownViewerTheme', themeName);
    
    // Apply theme to body for global styles
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.foreground;
    
    // Set CSS variables for theme colors
    const root = document.documentElement;
    root.style.setProperty('--search-highlight', theme.colors.searchHighlight);
    root.style.setProperty('--search-highlight-current', theme.colors.searchHighlightCurrent);
    root.style.setProperty('--scrollbar-track', theme.colors.scrollbarTrack);
    root.style.setProperty('--scrollbar-thumb', theme.colors.scrollbarThumb);
    root.style.setProperty('--scrollbar-thumb-hover', theme.colors.buttonHover);
    root.style.setProperty('--json-icon-color', theme.colors.jsonIcon);
  }, [themeName, theme]);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};