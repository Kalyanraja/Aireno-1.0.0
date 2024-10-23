// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Providers
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

// Utils & Constants
import { COLORS } from './src/constants/theme';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Keep splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

// Main App wrapper for theme
const MainApp = () => {
  const { theme } = useTheme();
  
  return (
    <NavigationContainer
      theme={{
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
        dark: theme === 'dark',
      }}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.statusBar}
        translucent
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Auth');

  useEffect(() => {
    initializeApp();
    setupNetworkListener();
  }, []);

  const setupNetworkListener = () => {
    return NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        // Handle offline state if needed
      }
    });
  };

  const initializeApp = async () => {
    try {
      // Load stored data
      const [userToken, themePreference] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('theme'),
      ]);

      // Set initial route based on authentication status
      if (userToken) {
        setInitialRoute('Main');
      }

      // Additional initialization logic here
      await loadCustomFonts();
      await loadAppData();

    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  const loadCustomFonts = async () => {
    // Load custom fonts if needed
    // Example using expo-font:
    // await Font.loadAsync({
    //   'custom-font': require('./assets/fonts/custom-font.ttf'),
    // });
  };

  const loadAppData = async () => {
    // Load any additional app data
    try {
      // Example: Load cached data, user preferences, etc.
    } catch (error) {
      console.error('Error loading app data:', error);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <MainApp initialRoute={initialRoute} />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to your error reporting service
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Export wrapped with ErrorBoundary
export default () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);