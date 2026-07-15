import { useEffect, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@stores';
import { logger } from '@logger';
import ThemeContext from './ThemeContext';
import { lightTheme } from './light';
import { darkTheme } from './dark';

interface Props {
  children: ReactNode;
}

/**
 * Follows the OS light/dark preference (ADR-009), unless the user has
 * chosen a manual override (Phase 011, ADR-024) — exactly the extension
 * point ADR-021 anticipated, requiring zero changes to any consumer, since
 * they only ever call useTheme(), never useColorScheme() directly.
 */
function ThemeProvider({ children }: Props) {
  const systemScheme = useColorScheme();
  const themeOverride = useSettingsStore(state => state.themeOverride);

  const resolvedMode =
    themeOverride === 'system' ? systemScheme : themeOverride;
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    logger.debug('ThemeProvider', 'Resolved theme changed', {
      mode: theme.mode,
      override: themeOverride,
    });
  }, [theme.mode, themeOverride]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export default ThemeProvider;
