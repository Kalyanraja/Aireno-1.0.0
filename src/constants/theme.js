// src/constants/theme.js
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary Colors
  primary: '#6C63FF',
  secondary: '#38CFBA',
  tertiary: '#FF6584',

  // Gradients
  gradientStart: '#6C63FF',
  gradientEnd: '#38CFBA',

  // Base Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Background Colors
  background: '#F8F9FE',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  modal: '#FFFFFF',

  // Text Colors
  text: '#1E1F20',
  textSecondary: '#6C6C80',
  textTertiary: '#A0A0B2',
  placeholder: '#A0A0B2',

  // Status Colors
  success: '#38CFBA',
  error: '#FF6584',
  warning: '#FFC107',
  info: '#2196F3',

  // Gray Scale
  gray100: '#F8F9FE',
  gray200: '#F5F5F8',
  gray300: '#E1E1E6',
  gray400: '#A0A0B2',
  gray500: '#6C6C80',

  // Border Colors
  border: '#E1E1E6',
  divider: '#F5F5F8',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // Transparent Colors
  transparent: 'transparent',
  transparentPrimary: 'rgba(108, 99, 255, 0.2)',
  transparentSecondary: 'rgba(56, 207, 186, 0.2)',

  // Component Specific Colors
  input: '#FFFFFF',
  inputBorder: '#E1E1E6',
  statusBar: '#6C63FF',
  navigationBar: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBarInactive: '#A0A0B2',
};

export const SIZES = {
  // Global Sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font Sizes
  largeTitle: 32,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  small: 10,

  // App Dimensions
  width,
  height,

  // Card Sizes
  cardWidth: width * 0.9,
  cardHeight: height * 0.2,

  // Image Sizes
  imageWidth: width * 0.9,
  imageHeight: height * 0.25,

  // Icon Sizes
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,

  // Button Sizes
  buttonHeight: 55,
  buttonRadius: 12,
  buttonPadding: 16,

  // Input Sizes
  inputHeight: 55,
  inputRadius: 12,
  inputPadding: 16,

  // Navigation Sizes
  bottomTabHeight: 60,
  headerHeight: 60,
};

export const FONTS = {
  largeTitle: {
    fontSize: SIZES.largeTitle,
    lineHeight: 40,
    fontFamily: 'System',
    fontWeight: '700',
  },
  h1: {
    fontSize: SIZES.h1,
    lineHeight: 36,
    fontFamily: 'System',
    fontWeight: '700',
  },
  h2: {
    fontSize: SIZES.h2,
    lineHeight: 30,
    fontFamily: 'System',
    fontWeight: '600',
  },
  h3: {
    fontSize: SIZES.h3,
    lineHeight: 22,
    fontFamily: 'System',
    fontWeight: '600',
  },
  h4: {
    fontSize: SIZES.h4,
    lineHeight: 20,
    fontFamily: 'System',
    fontWeight: '600',
  },
  h5: {
    fontSize: SIZES.h5,
    lineHeight: 18,
    fontFamily: 'System',
    fontWeight: '600',
  },
  body1: {
    fontSize: SIZES.body1,
    lineHeight: 36,
    fontFamily: 'System',
    fontWeight: '400',
  },
  body2: {
    fontSize: SIZES.body2,
    lineHeight: 30,
    fontFamily: 'System',
    fontWeight: '400',
  },
  body3: {
    fontSize: SIZES.body3,
    lineHeight: 22,
    fontFamily: 'System',
    fontWeight: '400',
  },
  body4: {
    fontSize: SIZES.body4,
    lineHeight: 20,
    fontFamily: 'System',
    fontWeight: '400',
  },
  body5: {
    fontSize: SIZES.body5,
    lineHeight: 18,
    fontFamily: 'System',
    fontWeight: '400',
  },
  small: {
    fontSize: SIZES.small,
    lineHeight: 16,
    fontFamily: 'System',
    fontWeight: '400',
  },
};

export const STYLES = {
  // Shadows
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shadowStrong: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  // Common Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: SIZES.base,
  },

  // Input Styles
  input: {
    height: SIZES.inputHeight,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.inputRadius,
    paddingHorizontal: SIZES.inputPadding,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },

  // Button Styles
  button: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonRadius,
    paddingHorizontal: SIZES.buttonPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Image Styles
  roundedImage: {
    borderRadius: SIZES.radius,
  },
  circleImage: {
    borderRadius: 999,
  },
};

// Layout Constants
export const LAYOUT = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  spacing: {
    xs: SIZES.base / 2,
    s: SIZES.base,
    m: SIZES.padding,
    l: SIZES.padding * 2,
    xl: SIZES.padding * 3,
  },
};

// Animation Constants
export const ANIMATION = {
  duration: {
    short: 150,
    base: 300,
    long: 500,
  },
  easing: {
    ease: [0.43, 0.13, 0.23, 0.96],
    easeOut: [0, 0, 0.58, 1],
    easeIn: [0.42, 0, 1, 1],
  },
};

export default {
  COLORS,
  SIZES,
  FONTS,
  STYLES,
  LAYOUT,
  ANIMATION,
};