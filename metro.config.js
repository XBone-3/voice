const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * Path aliases below mirror `compilerOptions.paths` in tsconfig.json and
 * `moduleNameMapper` in jest.config.js — all three must stay in sync.
 * See ADR-018 for why this uses Metro's built-in resolver instead of
 * babel-plugin-module-resolver.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
