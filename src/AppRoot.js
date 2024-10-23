// src/AppRoot.js
import React, { useEffect, useState } from 'react';
import { View, AppState, Platform, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
import { NotificationProvider } from './context/NotificationContext';
import Navigation from './navigation';
import LoadingOverlay from './components/LoadingOverlay';
import Toast from './components/Toast';
import NetworkAlert from './components/NetworkAlert';
import { StorageService } from './services/storage';
import { APP_CONFIG } from './config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const AppRoot = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  useEffect(() => {
    initializeApp();
    setupAppStateListener();
    setupNetworkListener();
    checkForUpdates();
    setupNotifications();
  }, []);

  const initializeApp = async () => {
    try {
      await StorageService.initialize();
      // Add any other initialization logic
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  const setupAppStateListener = () => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      checkForUpdates();
    }
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return unsubscribe;
  };

  const setupNotifications = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: APP_CONFIG.COLORS.primary,
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notifications Permission',
        'Please enable notifications to stay updated with your projects.',
        [{ text: 'OK' }]
      );
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Push token:', token);
    // Send this token to your server
  };

  const checkForUpdates = async () => {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setShowUpdateAlert(true);
        }
      }
    } catch (error) {
      console.error('Update check failed:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert(
        'Update Failed',
        'Please try again later or reinstall the app.',
        [{ text: 'OK' }]
      );
    }
  };

  const UpdateAlert = () => (
    showUpdateAlert && (
      <View style={styles.updateAlert}>
        <Text style={styles.updateText}>A new version is available!</Text>
        <Button title="Update Now" onPress={handleUpdate} />
      </View>
    )
  );

  return (
    <SafeAreaProvider>
      <LoadingProvider>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <View style={styles.container}>
                <Navigation />
                <LoadingOverlay />
                <Toast />
                <NetworkAlert isConnected={isConnected} />
                <UpdateAlert />
              </View>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </LoadingProvider>
    </SafeAreaProvider>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  updateAlert: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: APP_CONFIG.COLORS.primary,
    padding: 15,
    alignItems: 'center',
  },
  updateText: {
    color: '#fff',
    marginBottom: 10,
  },
};

export default AppRoot;