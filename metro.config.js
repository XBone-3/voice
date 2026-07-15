const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * Path aliases are handled by babel-plugin-module-resolver (babel.config.js),
 * not here — Metro's own resolver.extraNodeModules cannot resolve
 * `@alias/subpath` imports (see ADR-020).
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
