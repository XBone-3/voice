/**
 * The full ten-screen list from CLAUDE.md's Navigation section / ADR-012.
 * Only screens whose FEATURES flag is on (see src/env) are ever registered
 * with the navigator — see RootNavigator.tsx.
 */
export type RootStackParamList = {
  Home: undefined;
  Assistant: undefined;
  Notifications: undefined;
  Automation: undefined;
  Memory: undefined;
  History: undefined;
  Plugins: undefined;
  Settings: undefined;
  Developer: undefined;
  Diagnostics: undefined;
};
