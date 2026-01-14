import React, { createContext, useContext } from 'react';
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
  // Always use dark theme
  const getAntdTheme = () => {
    return {
      algorithm: [antdTheme.darkAlgorithm],
      token: {
        colorPrimary: '#1e90ff', // DodgerBlue as primary color
      }
    };
  };

  const value = {
    currentTheme: 'dark',
    toggleTheme: () => {}, // No-op function
    isDarkMode: true
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={getAntdTheme()}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};