// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const SettingsOption = ({ icon, title, value, onPress, type = 'arrow' }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={styles.optionLeft}>
      <Icon name={icon} size={22} color={COLORS.primary} />
      <Text style={styles.optionTitle}>{title}</Text>
    </View>
    {type === 'arrow' && (
      <Icon name="chevron-right" size={22} color={COLORS.gray400} />
    )}
    {type === 'switch' && (
      <Switch
        value={value}
        onValueChange={onPress}
        trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    )}
    {type === 'value' && (
      <Text style={styles.optionValue}>{value}</Text>
    )}
  </TouchableOpacity>
);

const SettingsSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    projectUpdates: true,
  });

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: signOut,
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            // Implement cache clearing logic
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="Account">
        <SettingsOption
          icon="user"
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SettingsOption
          icon="lock"
          title="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <SettingsOption
          icon="credit-card"
          title="Payment Methods"
          onPress={() => navigation.navigate('PaymentMethods')}
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsOption
          icon="bell"
          title="Push Notifications"
          type="switch"
          value={notifications.pushEnabled}
          onPress={() => setNotifications(prev => ({
            ...prev,
            pushEnabled: !prev.pushEnabled
          }))}
        />
        <SettingsOption
          icon="mail"
          title="Email Notifications"
          type="switch"
          value={notifications.emailEnabled}
          onPress={() => setNotifications(prev => ({
            ...prev,
            emailEnabled: !prev.emailEnabled
          }))}
        />
        <SettingsOption
          icon="refresh"
          title="Project Updates"
          type="switch"
          value={notifications.projectUpdates}
          onPress={() => setNotifications(prev => ({
            ...prev,
            projectUpdates: !prev.projectUpdates
          }))}
        />
      </SettingsSection>

      <SettingsSection title="Storage">
        <SettingsOption
          icon="database"
          title="Storage Used"
          type="value"
          value="1.2 GB"
        />
        <SettingsOption
          icon="trash-2"
          title="Clear Cache"
          onPress={handleClearCache}
        />
      </SettingsSection>

      <SettingsSection title="App">
        <SettingsOption
          icon="help-circle"
          title="Help & Support"
          onPress={() => navigation.navigate('Support')}
        />
        <SettingsOption
          icon="file-text"
          title="Terms of Service"
          onPress={() => navigation.navigate('Terms')}
        />
        <SettingsOption
          icon="shield"
          title="Privacy Policy"
          onPress={() => navigation.navigate('Privacy')}
        />
        <SettingsOption
          icon="info"
          title="About"
          type="value"
          value="Version 1.0.0"
        />
      </SettingsSection>

      <Button
        title="Sign Out"
        onPress={handleSignOut}
        outlined
        style={styles.signOutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.gray500,
    marginLeft: SIZES.padding,
    marginBottom: SIZES.base,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    ...FONTS.body3,
    color: COLORS.text,
    marginLeft: SIZES.padding,
  },
  optionValue: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  signOutButton: {
    margin: SIZES.padding,
    marginBottom: Platform.OS === 'ios' ? 40 : SIZES.padding,
  },
});

export default SettingsScreen;