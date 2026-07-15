import type { TypeStyle } from './typography';

export type ThemeMode = 'light' | 'dark';

/**
 * Material 3 design tokens (ADR-021, ADR-022). `colors` keeps the five
 * Phase 008 role names for backward compatibility and adds the fuller M3
 * vocabulary alongside; `typography`/`spacing`/`elevation`/`motion` are
 * mode-independent and identical between light and dark themes.
 */
export interface Theme {
  mode: ThemeMode;
  colors: {
    // Phase 008 roles (kept for compatibility with existing screens)
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;

    // Phase 009 additions — fuller Material 3 vocabulary
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    error: string;
    onError: string;
    outline: string;
  };
  typography: Record<
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headlineLarge'
    | 'headlineMedium'
    | 'headlineSmall'
    | 'titleLarge'
    | 'titleMedium'
    | 'titleSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodySmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall',
    TypeStyle
  >;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  elevation: {
    level0: number;
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
  motion: {
    durationShort: number;
    durationMedium: number;
    durationLong: number;
  };
}
