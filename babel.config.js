// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.json',
        ],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@context': './src/context',
          '@assets': './src/assets',
          '@utils': './src/utils',
          '@services': './src/services',
          '@config': './src/config',
        },
      },
    ],
    ['transform-remove-console', { exclude: ['error', 'warn'] }],
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};