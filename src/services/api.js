// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

// API Configuration
const API_CONFIG = {
  development: {
    baseURL: Platform.select({
      ios: 'http://localhost:3000/api',
      android: 'http://10.0.2.2:3000/api',
    }),
  },
  staging: {
    baseURL: 'https://api.aireno-staging.com/api',
  },
  production: {
    baseURL: 'https://api.aireno.com/api',
  },
};

const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    NOTIFICATIONS: '/user/notifications',
  },
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id) => `/projects/${id}`,
    CREATE: '/projects',
    UPDATE: (id) => `/projects/${id}`,
    DELETE: (id) => `/projects/${id}`,
  },
  PROCESSING: {
    UPLOAD: '/processing/upload',
    START: '/processing/start',
    STATUS: (jobId) => `/processing/status/${jobId}`,
    RESULT: (jobId) => `/processing/result/${jobId}`,
  },
};

class ApiService {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.config = API_CONFIG[this.environment];

    this.api = axios.create({
      baseURL: this.config.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': '1.0.0',
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

        // Add auth token if available
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (__DEV__) {
          console.log('API Request:', config);
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      response => {
        if (__DEV__) {
          console.log('API Response:', response);
        }
        return response.data;
      },
      async (error) => {
        if (__DEV__) {
          console.error('API Error:', error);
        }

        // Handle token refresh if needed
        if (error.response?.status === 401) {
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              const newToken = await this.refreshToken(refreshToken);
              if (newToken) {
                // Retry the original request with new token
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return this.api.request(error.config);
              }
            }
          } catch (refreshError) {
            await this.handleLogout();
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  handleError(error) {
    if (!error.response) {
      return {
        message: 'Network error occurred',
        code: 'NETWORK_ERROR',
      };
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        return {
          message: data.message || 'Invalid request',
          code: 'VALIDATION_ERROR',
          errors: data.errors,
        };
      case 401:
        return {
          message: 'Authentication required',
          code: 'AUTH_ERROR',
        };
      case 403:
        return {
          message: 'Access denied',
          code: 'FORBIDDEN_ERROR',
        };
      case 404:
        return {
          message: 'Resource not found',
          code: 'NOT_FOUND_ERROR',
        };
      case 422:
        return {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: data.errors,
        };
      default:
        return {
          message: 'Something went wrong',
          code: 'SERVER_ERROR',
        };
    }
  }

  // Auth Methods
  async login(email, password) {
    return this.api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  }

  async register(userData) {
    return this.api.post(ENDPOINTS.AUTH.REGISTER, userData);
  }

  async forgotPassword(email) {
    return this.api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async refreshToken(refreshToken) {
    const response = await this.api.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    if (response.token) {
      await AsyncStorage.setItem('userToken', response.token);
      return response.token;
    }
    return null;
  }

  // User Methods
  async getUserProfile() {
    return this.api.get(ENDPOINTS.USER.PROFILE);
  }

  async updateUserProfile(data) {
    return this.api.put(ENDPOINTS.USER.UPDATE_PROFILE, data);
  }

  // Project Methods
  async getProjects(params) {
    return this.api.get(ENDPOINTS.PROJECTS.LIST, { params });
  }

  async getProjectDetails(id) {
    return this.api.get(ENDPOINTS.PROJECTS.DETAIL(id));
  }

  async createProject(data) {
    return this.api.post(ENDPOINTS.PROJECTS.CREATE, data);
  }

  async updateProject(id, data) {
    return this.api.put(ENDPOINTS.PROJECTS.UPDATE(id), data);
  }

  async deleteProject(id) {
    return this.api.delete(ENDPOINTS.PROJECTS.DELETE(id));
  }

  // Image Processing Methods
  async uploadImage(formData, onProgress) {
    return this.api.post(ENDPOINTS.PROCESSING.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
  }

  async startProcessing(options) {
    return this.api.post(ENDPOINTS.PROCESSING.START, options);
  }

  async getProcessingStatus(jobId) {
    return this.api.get(ENDPOINTS.PROCESSING.STATUS(jobId));
  }

  async getProcessingResult(jobId) {
    return this.api.get(ENDPOINTS.PROCESSING.RESULT(jobId));
  }

  // Utility Methods
  async handleLogout() {
    await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
    // Additional cleanup if needed
  }
}

export default new ApiService();