// Path aliases below mirror compilerOptions.paths in tsconfig.json —
// keep both in sync. See ADR-020 for why this replaced Metro's built-in
// resolver.extraNodeModules (it cannot resolve `@alias/subpath` imports).
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@env': './src/env',
          '@logger': './src/logger',
          '@screens': './src/screens',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@stores': './src/stores',
          '@theme': './src/theme',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
