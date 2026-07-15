module.exports = {
  preset: '@react-native/jest-preset',
  // The preset's own transformIgnorePatterns only exempts react-native/
  // @react-native packages from transformation. @react-navigation and
  // react-native-screens ship ESM and need the same exemption, or Jest
  // fails on their `export` syntax (see Phase 007). Setting this key
  // replaces the preset's array rather than merging it, so its original
  // packages are repeated here alongside the new ones.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-screens)/)',
  ],
  // No moduleNameMapper: babel-jest applies babel.config.js's
  // module-resolver plugin during transform, so aliased imports are
  // already rewritten to relative paths before Jest resolves them (ADR-020).
};
