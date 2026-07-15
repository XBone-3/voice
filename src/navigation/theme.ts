import {
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import type { Theme } from '@theme';

/**
 * Bridges our app Theme (src/theme) into React Navigation's own theme
 * shape, so the native header bar matches instead of always showing
 * React Navigation's own light/dark defaults.
 */
export function toNavigationTheme(theme: Theme): NavigationTheme {
  return {
    dark: theme.mode === 'dark',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.surface,
      notification: theme.colors.primary,
    },
    fonts: DefaultTheme.fonts,
  };
}
