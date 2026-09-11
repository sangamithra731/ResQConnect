import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isDeviceFrame: boolean;
  toggleDeviceFrame: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('resq_theme');
    return saved === 'dark';
  });

  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem('resq_device_frame');
    return saved !== 'false'; // Default to true for showcase
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('resq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('resq_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('resq_device_frame', isDeviceFrame ? 'true' : 'false');
  }, [isDeviceFrame]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleDeviceFrame = () => setIsDeviceFrame(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isDeviceFrame, toggleDeviceFrame }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
