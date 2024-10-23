// src/utils/cacheManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@aireno_cache_';
const DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

class CacheManager {
  async set(key, data, expiry = DEFAULT_EXPIRY) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry,
      };
      await AsyncStorage.setItem(
        CACHE_PREFIX + key,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  async get(key) {
    try {
      const cached = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const { data, timestamp, expiry } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > expiry) {
        await this.remove(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  async remove(key) {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Cache remove error:', error);
    }
  }

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
}

export const cacheManager = new CacheManager();