// src/utils/permissions.js
import { Alert } from 'react-native';
import { check, request, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions';

class PermissionManager {
  static PERMISSION_TYPES = {
    CAMERA: PERMISSIONS.IOS.CAMERA,
    PHOTO_LIBRARY: PERMISSIONS.IOS.PHOTO_LIBRARY,
    PHOTO_LIBRARY_ADD: PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    LOCATION: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    NOTIFICATIONS: PERMISSIONS.IOS.NOTIFICATIONS,
  };

  static PERMISSION_MESSAGES = {
    CAMERA: {
      title: 'Camera Access Required',
      message: 'AiReno needs access to your camera to take photos for processing.',
      denied: 'Please enable camera access in your device settings to use this feature.',
    },
    PHOTO_LIBRARY: {
      title: 'Photo Library Access Required',
      message: 'AiReno needs access to your photos to select images for processing.',
      denied: 'Please enable photo library access in your device settings to use this feature.',
    },
    LOCATION: {
      title: 'Location Access Required',
      message: 'AiReno needs your location to provide location-based services.',
      denied: 'Please enable location access in your device settings to use this feature.',
    },
  };

  static async checkPermission(type) {
    try {
      const permission = this.PERMISSION_TYPES[type];
      if (!permission) throw new Error(`Invalid permission type: ${type}`);

      const result = await check(permission);
      
      switch (result) {
        case RESULTS.GRANTED:
          return true;
        
        case RESULTS.DENIED:
          const requestResult = await this.requestPermission(type);
          return requestResult;
        
        case RESULTS.BLOCKED:
          await this.showSettingsAlert(type);
          return false;
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  static async requestPermission(type) {
    try {
      const permission = this.PERMISSION_TYPES[type];
      const message = this.PERMISSION_MESSAGES[type];

      if (message) {
        const alertResult = await new Promise((resolve) => {
          Alert.alert(
            message.title,
            message.message,
            [
              { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
              { text: 'OK', onPress: () => resolve(true) },
            ]
          );
        });

        if (!alertResult) return false;
      }

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  static async showSettingsAlert(type) {
    const message = this.PERMISSION_MESSAGES[type];
    if (!message) return;

    Alert.alert(
      message.title,
      message.denied,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => openSettings() }
      ]
    );
  }

  // Convenience methods for common permissions
  static async requestCamera() {
    return this.checkPermission('CAMERA');
  }

  static async requestPhotoLibrary() {
    return this.checkPermission('PHOTO_LIBRARY');
  }

  static async requestLocation() {
    return this.checkPermission('LOCATION');
  }

  static async requestNotifications() {
    return this.checkPermission('NOTIFICATIONS');
  }
}

export default PermissionManager;

// Usage Example:
const ImagePickerComponent = () => {
  const handlePickImage = async () => {
    const hasPermission = await PermissionManager.requestPhotoLibrary();
    if (hasPermission) {
      // Proceed with image picking
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await PermissionManager.requestCamera();
    if (hasPermission) {
      // Proceed with camera
    }
  };
};