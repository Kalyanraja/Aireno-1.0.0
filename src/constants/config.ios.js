// src/constants/config.ios.js
export const IOS_CONFIG = {
    // iOS-specific dimensions and metrics
    METRICS: {
      NAVBAR_HEIGHT: 44,
      STATUSBAR_HEIGHT: 20,
      BOTTOM_SPACING: 34, // for iPhone X and newer
      TABBAR_HEIGHT: 49,
      SCREEN_EDGE_SPACING: 16,
    },
  
    // iOS-specific permissions
    PERMISSIONS: {
      PHOTO_LIBRARY: 'photo',
      CAMERA: 'camera',
      NOTIFICATIONS: 'notification',
      LOCATION: 'location',
    },
  
    // iOS-specific animation configurations
    ANIMATIONS: {
      SPRING_CONFIG: {
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      },
      TIMING_CONFIG: {
        duration: 300,
        useNativeDriver: true,
      },
    },
  };