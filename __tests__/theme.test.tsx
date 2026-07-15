import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import * as RN from 'react-native';
import { ThemeProvider, useTheme } from '@theme';

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
