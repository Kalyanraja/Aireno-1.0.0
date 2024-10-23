// src/utils/errorHandler.js
import { Alert } from 'react-native';

export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

export const handleApiError = (error) => {
  if (!error.response) {
    // Network error
    return {
      type: ERROR_TYPES.NETWORK,
      message: 'Network error occurred. Please check your connection.',
      original: error,
    };
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return {
        type: ERROR_TYPES.VALIDATION,
        message: data.message || 'Invalid request',
        errors: data.errors,
        original: error,
      };
    case 401:
      return {
        type: ERROR_TYPES.AUTH,
        message: 'Authentication failed',
        original: error,
      };
    case 403:
      return {
        type: ERROR_TYPES.AUTH,
        message: 'Access denied',
        original: error,
      };
    case 404:
      return {
        type: ERROR_TYPES.API,
        message: 'Resource not found',
        original: error,
      };
    case 422:
      return {
        type: ERROR_TYPES.VALIDATION,
        message: 'Validation error',
        errors: data.errors,
        original: error,
      };
    case 500:
      return {
        type: ERROR_TYPES.API,
        message: 'Server error occurred',
        original: error,
      };
    default:
      return {
        type: ERROR_TYPES.UNKNOWN,
        message: 'An unexpected error occurred',
        original: error,
      };
  }
};

export const showErrorAlert = (error) => {
  Alert.alert(
    'Error',
    error.message || 'An error occurred',
    [{ text: 'OK' }]
  );
};

export default {
  handleApiError,
  showErrorAlert,
  ERROR_TYPES,
};