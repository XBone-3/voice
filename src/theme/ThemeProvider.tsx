import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import ThemeContext from './ThemeContext';
import { lightTheme } from './light';
import { darkTheme } from './dark';

interface Props {
  children: ReactNode;
}

/**
 * Follows the OS light/dark preference (ADR-009). A manual override could
 * be added later without touching consumers — they only ever call
 * useTheme(), never read useColorScheme() directly.
 */
function ThemeProvider({ children }: Props) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export default ThemeProvider;
