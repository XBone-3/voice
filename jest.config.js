module.exports = {
  preset: '@react-native/jest-preset',
  // Mirrors the aliases in metro.config.js resolver.extraNodeModules and
  // tsconfig.json compilerOptions.paths — keep all three in sync (ADR-018).
  moduleNameMapper: {
    '^@screens$': '<rootDir>/src/screens/index',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@components$': '<rootDir>/src/components/index',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@navigation$': '<rootDir>/src/navigation/index',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@hooks$': '<rootDir>/src/hooks/index',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services$': '<rootDir>/src/services/index',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@stores$': '<rootDir>/src/stores/index',
    '^@stores/(.*)$': '<rootDir>/src/stores/$1',
    '^@theme$': '<rootDir>/src/theme/index',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@assets$': '<rootDir>/src/assets/index',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
  },
};
