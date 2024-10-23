// src/screens/NotificationsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Loading from '../components/Loading';
import Error from '../components/Error';

const NotificationItem = ({ notification, onPress }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return { name: 'check-circle', color: COLORS.success };
      case 'warning':
        return { name: 'alert-triangle', color: COLORS.warning };
      case 'error':
        return { name: 'x-circle', color: COLORS.error };
      case 'processing':
        return { name: 'clock', color: COLORS.primary };
      default:
        return { name: 'bell', color: COLORS.primary };
    }
  };

  const icon = getIcon();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.notificationItem,
          !notification.read && styles.unreadNotification,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
          <Icon name={icon.name} size={24} color={icon.color} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
        {!notification.read && <View style={styles.unreadDot} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockNotifications = [
        {
          id: '1',
          title: 'Project Completed',
          message: 'Your living room design has been successfully processed.',
          time: '2 min ago',
          type: 'success',
          read: false,
        },
        {
          id: '2',
          title: 'Processing Started',
          message: 'We\'ve begun processing your kitchen renovation images.',
          time: '1 hour ago',
          type: 'processing',
          read: false,
        },
        {
          id: '3',
          title: 'Storage Warning',
          message: 'You\'re approaching your storage limit. Consider upgrading.',
          time: '3 hours ago',
          type: 'warning',
          read: true,
        },
        // Add more mock notifications...
      ];

      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id
          ? { ...n, read: true }
          : n
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'success':
      case 'processing':
        navigation.navigate('ProjectDetails', { projectId: notification.projectId });
        break;
      case 'warning':
        navigation.navigate('Settings');
        break;
      default:
        // Handle other navigation cases
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const renderHeader = () => {
    const unreadCount = notifications.filter(n => !n.read).length;

    if (unreadCount === 0) return null;

    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
        </Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchNotifications} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={50} color={COLORS.gray400} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  headerText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  markAllText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadNotification: {
    backgroundColor: COLORS.primary + '08',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  notificationMessage: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginBottom: SIZES.base,
  },
  notificationTime: {
    ...FONTS.body5,
    color: COLORS.gray400,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.gray500,
    marginTop: SIZES.padding,
  },
});

export default NotificationsScreen;