// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({});

// Define theme colors
export const lightTheme = {
  primary: '#6C63FF',
  secondary: '#38CFBA',
  background: '#F8F9FE',
  surface: '#FFFFFF',
  text: '#1E1F20',
  textSecondary: '#6C6C80',
  border: '#E1E1E6',
  error: '#FF6584',
  success: '#38CFBA',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Additional colors
  gray100: '#F8F9FE',
  gray200: '#F5F5F8',
  gray300: '#E1E1E6',
  gray400: '#A0A0B2',
  gray500: '#6C6C80',
  
  // Gradients
  gradientStart: '#6C63FF',
  gradientEnd: '#38CFBA',
  
  // Component specific
  card: '#FFFFFF',
  input: '#FFFFFF',
  inputBorder: '#E1E1E6',
  placeholder: '#A0A0B2',
  
  // Status colors
  statusBar: '#6C63FF',
  navigationBar: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBarInactive: '#A0A0B2',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  modalBackground: '#FFFFFF',
};

export const darkTheme = {
  primary: '#8B85FF',
  secondary: '#45E6D1',
  background: '#121214',
  surface: '#1E1E24',
  text: '#FFFFFF',
  textSecondary: '#A0A0B2',
  border: '#2E2E36',
  error: '#FF7B98',
  success: '#45E6D1',
  warning: '#FFD54F',
  info: '#64B5F6',
  
  // Additional colors
  gray100: '#1E1E24',
  gray200: '#2E2E36',
  gray300: '#3E3E48',
  gray400: '#A0A0B2',
  gray500: '#C9C9D4',
  
  // Gradients
  gradientStart: '#8B85FF',
  gradientEnd: '#45E6D1',
  
  // Component specific
  card: '#1E1E24',
  input: '#2E2E36',
  inputBorder: '#3E3E48',
  placeholder: '#6C6C80',
  
  // Status colors
  statusBar: '#121214',
  navigationBar: '#1E1E24',
  tabBar: '#1E1E24',
  tabBarInactive: '#6C6C80',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  modalBackground: '#1E1E24',
};

// Define spacing and typography
export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  small: 10,
};

export const FONTS = {
  largeTitle: {
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {
    fontSize: SIZES.h1,
    lineHeight: 36,
    fontWeight: '700',
  },
  h2: {
    fontSize: SIZES.h2,
    lineHeight: 30,
    fontWeight: '600',
  },
  h3: {
    fontSize: SIZES.h3,
    lineHeight: 22,
    fontWeight: '600',
  },
  h4: {
    fontSize: SIZES.h4,
    lineHeight: 20,
    fontWeight: '600',
  },
  body1: {
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontSize: SIZES.body4,
    lineHeight: 20,
  },
  body5: {
    fontSize: SIZES.body5,
    lineHeight: 18,
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setThemeType(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (type) => {
    try {
      await AsyncStorage.setItem('theme', type);
      setThemeType(type);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const getCurrentTheme = () => {
    if (themeType === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeType === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getCurrentTheme();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: themeType === 'dark' || (themeType === 'system' && systemColorScheme === 'dark'),
        themeType,
        setTheme,
        SIZES,
        FONTS,
      }}
    >
      {!isLoading && children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Style helpers
export const createStyles = (styleFunction) => {
  return () => {
    const { theme } = useTheme();
    return styleFunction(theme);
  };
};

export default {
  ThemeProvider,
  useTheme,
  createStyles,
  lightTheme,
  darkTheme,
  SIZES,
  FONTS,
};