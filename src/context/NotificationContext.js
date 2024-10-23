// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, Animated } from 'react-native';
import { APP_CONFIG } from '../config';

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [animation] = useState(new Animated.Value(0));

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    });
  }, [animation]);

  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return { backgroundColor: APP_CONFIG.COLORS.success };
      case 'error':
        return { backgroundColor: APP_CONFIG.COLORS.error };
      case 'warning':
        return { backgroundColor: APP_CONFIG.COLORS.warning };
      default:
        return { backgroundColor: APP_CONFIG.COLORS.info };
    }
  };

  return (
    <NotificationContext.Provider value={{
      showNotification,
      hideNotification,
    }}>
      {children}
      {notifications.map(notification => (
        <Animated.View
          key={notification.id}
          style={[
            styles.notification,
            getNotificationStyle(notification.type),
            {
              transform: [{
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={styles.notificationText}>{notification.message}</Text>
        </Animated.View>
      ))}
    </NotificationContext.Provider>
  );
};

const styles = {
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
  },
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};