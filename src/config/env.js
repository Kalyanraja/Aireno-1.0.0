// src/config/env.js
export const ENV = {
    development: {
      API_URL: Platform.select({
        ios: 'http://localhost:3000/api',
        android: 'http://10.0.2.2:3000/api',
      }),
      ENABLE_LOGS: true,
    },
    staging: {
      API_URL: 'https://api.aireno-staging.com/api',
      ENABLE_LOGS: true,
    },
    production: {
      API_URL: 'https://api.aireno.com/api',
      ENABLE_LOGS: false,
    },
  };
  
  export const getEnvironment = () => {
    return ENV[process.env.NODE_ENV || 'development'];
  };
  
  export default {
    ...getEnvironment(),
    APP_NAME: 'AiReno',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
  };