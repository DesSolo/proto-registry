import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('system');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setCurrentTheme(savedTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only update if current theme is 'system'
      if (currentTheme === 'system') {
        // Force re-render to update theme when system theme changes
        setCurrentTheme(prev => {
          // Toggle to a temporary value and back to trigger re-render
          return 'system-update';
        });
        setTimeout(() => setCurrentTheme('system'), 0);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  // Determine the Ant Design theme algorithm based on current theme setting
  const getAntdTheme = () => {
    let algorithm;

    if (currentTheme === 'system' || currentTheme === 'system-update') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      algorithm = isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
    } else {
      algorithm = currentTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
    }

    return {
      algorithm: [algorithm],
      token: {
        colorPrimary: '#1e90ff', // DodgerBlue as primary color
      }
    };
  };

  const toggleTheme = (themeValue) => {
    setCurrentTheme(themeValue);
    localStorage.setItem('theme', themeValue);
  };

  const value = {
    currentTheme,
    toggleTheme,
    isDarkMode: currentTheme === 'dark' ||
               (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={getAntdTheme()}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};