import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { ThemeProvider } from '@theme';
import { useSettingsStore } from '@stores';
import { APP_NAME, APP_VERSION, FEATURES } from '@env';
import DeveloperScreen from '../src/screens/developer/DeveloperScreen';

let currentRoot: ReactTestRenderer.ReactTestRenderer | null = null;

function renderScreen() {
  act(() => {
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

test('shows real build info', () => {
  const root = renderScreen();
  const allText = root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  expect(allText).toContain(APP_NAME);
  expect(allText).toContain(APP_VERSION);
});

test('shows the current theme override', () => {
  useSettingsStore.getState().setThemeOverride('dark');
  const root = renderScreen();
  const allText = root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  expect(allText).toContain('dark');
});

test('shows every feature flag with its actual Enabled/Disabled state', () => {
  const root = renderScreen();
  const allText = root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  expect(allText).toContain('assistant');
  expect(allText).toContain(FEATURES.assistant ? 'Enabled' : 'Disabled');
  expect(allText).toContain('developer');
  expect(allText).toContain(FEATURES.developer ? 'Enabled' : 'Disabled');
});
