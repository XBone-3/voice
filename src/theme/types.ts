export type ThemeMode = 'light' | 'dark';

/**
 * Minimal Material 3 color roles needed to un-hardcode Phase 007's screens.
 * The full token catalog (typography scale, spacing scale, elevation,
 * motion) is Phase 009's job — see ADR-021.
 */
export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
}
