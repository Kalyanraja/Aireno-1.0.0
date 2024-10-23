// src/navigation/AppNavigator.js
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../constants/theme';

// Auth Screens
import AuthScreen from '../screens/AuthScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';
import ImageUploadScreen from '../screens/ImageUploadScreen';
import ProcessingOptionsScreen from '../screens/ProcessingOptionsScreen';
import ResultsDisplayScreen from '../screens/ResultsDisplayScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

// Context
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: COLORS.white,
  headerTitleStyle: {
    ...FONTS.h4,
  },
  headerLeftContainerStyle: {
    paddingLeft: 15,
  },
  headerRightContainerStyle: {
    paddingRight: 15,
  },
};

// Auth Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={({ navigation }) => ({
        title: 'Home',
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ),
      })}
    />
  </Stack.Navigator>
);

// Projects Stack
const ProjectsStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Projects" component={ProjectsScreen} />
    <Stack.Screen 
      name="ProjectDetails" 
      component={ProjectDetailsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Upload Stack
const UploadStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="ImageUpload" 
      component={ImageUploadScreen}
      options={{ title: 'New Project' }}
    />
    <Stack.Screen 
      name="ProcessingOptions" 
      component={ProcessingOptionsScreen}
      options={{ title: 'Select Options' }}
    />
    <Stack.Screen 
      name="ResultsDisplay" 
      component={ResultsDisplayScreen}
      options={{ title: 'Results' }}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="Profile" 
      component={UserProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="EditProfile" 
      component={EditProfileScreen}
      options={{ title: 'Edit Profile' }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
  </Stack.Navigator>
);

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = 'home';
        } else if (route.name === 'ProjectsTab') {
          iconName = 'grid';
        } else if (route.name === 'UploadTab') {
          iconName = 'plus-square';
        } else if (route.name === 'ProfileTab') {
          iconName = 'user';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray400,
      tabBarStyle: {
        height: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
      },
      tabBarLabelStyle: {
        ...FONTS.body5,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="HomeTab" 
      component={HomeStack}
      options={{ title: 'Home' }}
    />
    <Tab.Screen 
      name="ProjectsTab" 
      component={ProjectsStack}
      options={{ title: 'Projects' }}
    />
    <Tab.Screen 
      name="UploadTab" 
      component={UploadStack}
      options={{ title: 'Upload' }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileStack}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthStack /> : <TabNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;