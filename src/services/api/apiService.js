// src/services/api/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ENV from '../../config/env.config';
import { handleApiError } from '../../utils/errorHandler';
import { cacheManager } from '../../utils/cacheManager';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: ENV.API_URL,
      timeout: ENV.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-App-Version': ENV.VERSION,
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        // Check network connectivity
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          throw new Error('No internet connection');
        }

        // Add authentication token
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Check cache for GET requests
        if (config.method === 'get') {
          const cachedData = await cacheManager.get(config.url);
          if (cachedData) {
            return Promise.resolve(cachedData);
          }
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      async (response) => {
        // Cache successful GET requests
        if (response.config.method === 'get') {
          await cacheManager.set(response.config.url, response.data);
        }
        return response.data;
      },
      async (error) => {
        return handleApiError(error);
      }
    );
  }

  // Authentication endpoints
  async login(email, password) {
    try {
      const response = await this.api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('userToken', response.token);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post('/auth/register', userData);
      await AsyncStorage.setItem('userToken', response.token);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Project endpoints
  async getProjects(params) {
    return this.api.get('/projects', { params });
  }

  async getProjectDetails(id) {
    return this.api.get(`/projects/${id}`);
  }

  async createProject(data) {
    return this.api.post('/projects', data);
  }

  // Image processing endpoints
  async uploadImage(formData, onProgress) {
    return this.api.post('/processing/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress?.(progress);
      },
    });
  }

  async processImage(imageId, options) {
    return this.api.post('/processing/process', { imageId, options });
  }

  // User profile endpoints
  async getUserProfile() {
    return this.api.get('/user/profile');
  }

  async updateUserProfile(data) {
    return this.api.put('/user/profile', data);
  }

  // Utility methods
  async clearCache() {
    await cacheManager.clear();
  }

  async logout() {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    await this.clearCache();
  }
}

export default new ApiService();