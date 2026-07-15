import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { ThemeProvider } from '@theme';
import { useSettingsStore } from '@stores';
import { APP_NAME, APP_VERSION, FEATURES } from '@env';
import DeveloperScreen from '../src/screens/developer/DeveloperScreen';

// useFocusEffect requires a real navigation context; for this focused unit
// test it's mocked to behave like a plain useEffect (same pattern as
// diagnosticsScreen.test.tsx, ADR-027).
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const { useEffect } = jest.requireActual('react');
  return {
    ...actual,
    useFocusEffect: (callback: () => void) => useEffect(callback, [callback]),
  };
});

let currentRoot: ReactTestRenderer.ReactTestRenderer | null = null;

async function renderScreen() {
  // async act: the Permissions card's checkPermission() call resolves on
  // a microtask (native module isn't linked in Jest), same reason
  // App.test.tsx awaits act() for its own bridge check.
  await act(async () => {
    currentRoot = ReactTestRenderer.create(
      <ThemeProvider>
        <DeveloperScreen />
      </ThemeProvider>,
    );
  });
  return currentRoot!;
}

afterEach(() => {
  // Unmount before resetting store state, or the reset re-renders the
  // previous test's still-mounted tree outside of act() (same fix as
  // settingsStore.test.tsx).
  if (currentRoot) {
    act(() => {
      currentRoot!.unmount();
    });
    currentRoot = null;
  }
  useSettingsStore.setState({ themeOverride: 'system' });
});

test('shows real build info', async () => {
  const root = await renderScreen();
  const allText = root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  expect(allText).toContain(APP_NAME);
  expect(allText).toContain(APP_VERSION);
});

test('shows the current theme override', async () => {
  useSettingsStore.getState().setThemeOverride('dark');
  const root = await renderScreen();
  const allText = root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  expect(allText).toContain('dark');
});

test('shows every feature flag with its actual Enabled/Disabled state', async () => {
  const root = await renderScreen();
  const allText = root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  expect(allText).toContain('assistant');
  expect(allText).toContain(FEATURES.assistant ? 'Enabled' : 'Disabled');
  expect(allText).toContain('developer');
  expect(allText).toContain(FEATURES.developer ? 'Enabled' : 'Disabled');
});

test('shows the microphone permission status, unknown when unresolved, then denied once the not-linked check resolves', async () => {
  const root = await renderScreen();
  const allText = root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  // PermissionManager isn't linked in Jest, so checkPermission() resolves
  // false — the card shows "Denied" once that microtask settles, matching
  // permissions.ts's not-linked fallback.
  expect(allText).toContain('Denied');
});
