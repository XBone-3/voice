import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import * as RN from 'react-native';
import { ThemeProvider, useTheme } from '@theme';
import { useSettingsStore } from '@stores';

function Probe() {
  const theme = useTheme();
  return <Text testID="mode">{theme.mode}</Text>;
}

let currentRoot: ReactTestRenderer.ReactTestRenderer | null = null;

function renderWithTheme() {
  act(() => {
    currentRoot = ReactTestRenderer.create(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
  });
  return currentRoot!;
}

afterEach(() => {
  // Unmount before resetting store state, or the reset re-renders the
  // previous test's still-mounted tree outside of act().
  if (currentRoot) {
    act(() => {
      currentRoot!.unmount();
    });
    currentRoot = null;
  }
  jest.restoreAllMocks();
  useSettingsStore.setState({ themeOverride: 'system' });
});

test('defaults to "system"', () => {
  expect(useSettingsStore.getState().themeOverride).toBe('system');
});

test('setThemeOverride updates the store', () => {
  useSettingsStore.getState().setThemeOverride('dark');
  expect(useSettingsStore.getState().themeOverride).toBe('dark');
});

test('with override "system", ThemeProvider still follows the OS scheme', () => {
  jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');
  const root = renderWithTheme();
  expect(root.root.findByProps({ testID: 'mode' }).props.children).toBe('dark');
});

test('override "light" wins even when the OS scheme is dark', () => {
  jest.spyOn(RN, 'useColorScheme').mockReturnValue('dark');
  useSettingsStore.getState().setThemeOverride('light');

  const root = renderWithTheme();
  expect(root.root.findByProps({ testID: 'mode' }).props.children).toBe(
    'light',
  );
});

test('override "dark" wins even when the OS scheme is light', () => {
  jest.spyOn(RN, 'useColorScheme').mockReturnValue('light');
  useSettingsStore.getState().setThemeOverride('dark');

  const root = renderWithTheme();
  expect(root.root.findByProps({ testID: 'mode' }).props.children).toBe('dark');
});
