import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import * as RN from 'react-native';
import { ThemeProvider, useTheme } from '@theme';
import { lightTheme } from '@theme/light';
import { darkTheme } from '@theme/dark';

function Probe() {
  const theme = useTheme();
  return <Text testID="mode">{theme.mode}</Text>;
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('ThemeProvider resolves to the light theme when the OS scheme is light', () => {
  jest.spyOn(RN, 'useColorScheme').mockReturnValue('light');

  let root: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    root = ReactTestRenderer.create(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
  });

  expect(root!.root.findByProps({ testID: 'mode' }).props.children).toBe(
    'light',
  );
});

test('ThemeProvider resolves to the dark theme when the OS scheme is dark', () => {
  jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');

  let root: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    root = ReactTestRenderer.create(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
  });

  expect(root!.root.findByProps({ testID: 'mode' }).props.children).toBe(
    'dark',
  );
});

test('typography, spacing, elevation, and motion are identical between light and dark (only colors differ)', () => {
  expect(darkTheme.typography).toEqual(lightTheme.typography);
  expect(darkTheme.spacing).toEqual(lightTheme.spacing);
  expect(darkTheme.elevation).toEqual(lightTheme.elevation);
  expect(darkTheme.motion).toEqual(lightTheme.motion);
  expect(darkTheme.colors).not.toEqual(lightTheme.colors);
});

test('the full Material 3 type scale is present', () => {
  const styles = Object.keys(lightTheme.typography);
  expect(styles).toEqual([
    'displayLarge',
    'displayMedium',
    'displaySmall',
    'headlineLarge',
    'headlineMedium',
    'headlineSmall',
    'titleLarge',
    'titleMedium',
    'titleSmall',
    'bodyLarge',
    'bodyMedium',
    'bodySmall',
    'labelLarge',
    'labelMedium',
    'labelSmall',
  ]);
});

test('elevation levels increase monotonically', () => {
  const levels = Object.values(lightTheme.elevation);
  for (let i = 1; i < levels.length; i++) {
    expect(levels[i]).toBeGreaterThan(levels[i - 1]);
  }
});
