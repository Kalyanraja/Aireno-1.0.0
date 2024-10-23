// src/utils/network.js
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export const checkConnectivity = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
};

export const withNetworkCheck = (apiCall) => async (...args) => {
  const isConnected = await checkConnectivity();
  if (!isConnected) {
    throw new Error('No internet connection');
  }
  return apiCall(...args);
};

export const withRetry = (apiCall, retries = 3, delay = 1000) => async (...args) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall(...args);
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
};

export const createApiHandler = (apiCall, options = {}) => {
  const {
    withNetwork = true,
    withRetries = true,
    retries = 3,
    onSuccess,
    onError,
    onFinally,
  } = options;

  let handler = apiCall;

  if (withNetwork) {
    handler = withNetworkCheck(handler);
  }

  if (withRetries) {
    handler = withRetry(handler, retries);
  }

  return async (...args) => {
    try {
      const result = await handler(...args);
      onSuccess?.(result);
      return result;
    } catch (error) {
      onError?.(error);
      throw error;
    } finally {
      onFinally?.();
    }
  };
};

export const handleApiError = (error) => {
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
        code: 'BAD_REQUEST',
        errors: data.errors,
      };
    case 401:
      return {
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      };
    case 403:
      return {
        message: 'Access denied',
        code: 'FORBIDDEN',
      };
    case 404:
      return {
        message: 'Resource not found',
        code: 'NOT_FOUND',
      };
    case 422:
      return {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: data.errors,
      };
    case 429:
      return {
        message: 'Too many requests',
        code: 'RATE_LIMIT',
      };
    case 500:
      return {
        message: 'Server error occurred',
        code: 'SERVER_ERROR',
      };
    default:
      return {
        message: 'Something went wrong',
        code: 'UNKNOWN_ERROR',
      };
  }
};

export const getBaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return 'https://api.aireno.com/api';
    case 'staging':
      return 'https://api.aireno-staging.com/api';
    default:
      return Platform.select({
        ios: 'http://localhost:3000/api',
        android: 'http://10.0.2.2:3000/api',
      });
  }
};

export default {
  checkConnectivity,
  withNetworkCheck,
  withRetry,
  createApiHandler,
  handleApiError,
  getBaseUrl,
};