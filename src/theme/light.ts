import type { Theme } from './types';
import { typography } from './typography';
import { spacing } from './spacing';
import { elevation } from './elevation';
import { motion } from './motion';

// Material 3 baseline light color scheme.
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    surface: '#F3F3F3',
    text: '#1C1B1F',
    textSecondary: '#49454F',
    primary: '#6750A4',

    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    onBackground: '#1C1B1F',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    error: '#B3261E',
    onError: '#FFFFFF',
    outline: '#79747E',
  },
  typography,
  spacing,
  elevation,
  motion,
};
