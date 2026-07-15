import { createContext, useContext } from 'react';
import type { Theme } from './types';
import { lightTheme } from './light';

const ThemeContext = createContext<Theme>(lightTheme);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export default ThemeContext;
