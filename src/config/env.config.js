import { Platform } from 'react-native';
import Config from 'react-native-config';

const ENV = {
  dev: {
    API_URL: Platform.select({
      ios: 'http://localhost:3000/api',
      android: 'http://10.0.2.2:3000/api',
    }),
    ENVIRONMENT: 'development',
  },
  staging: {
    API_URL: 'https://api.aireno-staging.com/api',
    ENVIRONMENT: 'staging',
  },
  prod: {
    API_URL: 'https://api.aireno.com/api',
    ENVIRONMENT: 'production',
  },
};

export default {
  ...ENV[Config.ENVIRONMENT || 'dev'],
  IS_DEV: __DEV__,
  API_TIMEOUT: 30000,
  APP_NAME: 'AiReno',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
};