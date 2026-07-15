import type { Theme } from './types';
import { typography } from './typography';
import { spacing } from './spacing';
import { elevation } from './elevation';
import { motion } from './motion';

// Material 3 baseline dark color scheme.
export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#1C1B1F',
    surface: '#2B2930',
    text: '#E6E1E5',
    textSecondary: '#CAC4D0',
    primary: '#D0BCFF',

    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    onBackground: '#E6E1E5',
    onSurface: '#E6E1E5',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    error: '#F2B8B5',
    onError: '#601410',
    outline: '#938F99',
  },
  typography,
  spacing,
  elevation,
  motion,
};
