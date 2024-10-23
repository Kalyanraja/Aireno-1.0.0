// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS: 'notifications',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  RECENT_SEARCHES: 'recentSearches',
  CACHED_PROJECTS: 'cachedProjects',
  APP_SETTINGS: 'appSettings',
};

class StorageService {
  static async set(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Storage Set Error:', error);
      return false;
    }
  }

  static async get(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage Get Error:', error);
      return null;
    }
  }

  static async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage Remove Error:', error);
      return false;
    }
  }

  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage Clear Error:', error);
      return false;
    }
  }

  // Auth related methods
  static async setTokens(accessToken, refreshToken) {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      ]);
      return true;
    } catch (error) {
      console.error('Set Tokens Error:', error);
      return false;
    }
  }

  static async clearAuth() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      return true;
    } catch (error) {
      console.error('Clear Auth Error:', error);
      return false;
    }
  }

  // User data methods
  static async setUserData(userData) {
    return this.set(STORAGE_KEYS.USER_DATA, userData);
  }

  static async getUserData() {
    return this.get(STORAGE_KEYS.USER_DATA);
  }

  // Settings methods
  static async setTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  }

  static async getTheme() {
    return this.get(STORAGE_KEYS.THEME);
  }

  static async setLanguage(language) {
    return this.set(STORAGE_KEYS.LANGUAGE, language);
  }

  static async getLanguage() {
    return this.get(STORAGE_KEYS.LANGUAGE);
  }

  // Projects methods
  static async cacheProjects(projects) {
    return this.set(STORAGE_KEYS.CACHED_PROJECTS, {
      data: projects,
      timestamp: Date.now(),
    });
  }

  static async getCachedProjects(maxAge = 5 * 60 * 1000) { // 5 minutes default
    const cached = await this.get(STORAGE_KEYS.CACHED_PROJECTS);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    return age > maxAge ? null : cached.data;
  }

  // Recent searches
  static async addRecentSearch(search) {
    const searches = await this.get(STORAGE_KEYS.RECENT_SEARCHES) || [];
    const updatedSearches = [
      search,
      ...searches.filter(s => s !== search),
    ].slice(0, 10); // Keep only last 10 searches
    return this.set(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
  }

  static async getRecentSearches() {
    return this.get(STORAGE_KEYS.RECENT_SEARCHES) || [];
  }

  static async clearRecentSearches() {
    return this.remove(STORAGE_KEYS.RECENT_SEARCHES);
  }

  // App settings
  static async updateAppSettings(settings) {
    const currentSettings = await this.get(STORAGE_KEYS.APP_SETTINGS) || {};
    const updatedSettings = { ...currentSettings, ...settings };
    return this.set(STORAGE_KEYS.APP_SETTINGS, updatedSettings);
  }

  static async getAppSettings() {
    return this.get(STORAGE_KEYS.APP_SETTINGS) || {};
  }

  // Storage management
  static async getStorageSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      for (const key of keys) {
        const item = await AsyncStorage.getItem(key);
        totalSize += item ? item.length : 0;
      }
      return totalSize;
    } catch (error) {
      console.error('Get Storage Size Error:', error);
      return 0;
    }
  }

  static async cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days default
    try {
      const cachedData = await this.get(STORAGE_KEYS.CACHED_PROJECTS);
      if (cachedData && (Date.now() - cachedData.timestamp > maxAge)) {
        await this.remove(STORAGE_KEYS.CACHED_PROJECTS);
      }
      // Add more cleanup logic as needed
      return true;
    } catch (error) {
      console.error('Storage Cleanup Error:', error);
      return false;
    }
  }
}

export { STORAGE_KEYS, StorageService };