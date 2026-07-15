import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { ThemeProvider } from '@theme';
import { logger } from '@logger';
import DiagnosticsScreen from '../src/screens/diagnostics/DiagnosticsScreen';

// useFocusEffect requires a real navigation context; for this focused unit
// test it's mocked to behave like a plain useEffect (standard pattern for
// testing screens that use React Navigation's focus hooks in isolation).
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const { useEffect } = jest.requireActual('react');
  return {
    ...actual,
    useFocusEffect: (callback: () => void) => useEffect(callback, [callback]),
  };
});

function renderScreen() {
  let root: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    root = ReactTestRenderer.create(
      <ThemeProvider>
        <DiagnosticsScreen />
      </ThemeProvider>,
    );
  });
  return root!;
}

function textOf(root: ReactTestRenderer.ReactTestRenderer) {
  return root.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();
}

function pressButton(
  root: ReactTestRenderer.ReactTestRenderer,
  testID: string,
) {
  act(() => {
    root.root.findByProps({ testID }).props.onPress();
  });
}

beforeEach(() => {
  logger.clear();
});

test('shows an empty state when there are no log entries', () => {
  const root = renderScreen();
  expect(textOf(root)).toContain('No log entries yet.');
});

test('shows existing log entries on mount', () => {
  logger.info('Test', 'first entry');
  logger.error('Test', 'second entry');

  const root = renderScreen();
  expect(textOf(root)).toContain('first entry');
  expect(textOf(root)).toContain('second entry');
});

test('Refresh picks up entries logged after the initial render', () => {
  const root = renderScreen();
  expect(textOf(root)).toContain('No log entries yet.');

  logger.info('Test', 'added later');
  pressButton(root, 'refresh-logs');

  expect(textOf(root)).toContain('added later');
});

test('Clear empties both the logger and the displayed list', () => {
  logger.info('Test', 'to be cleared');
  const root = renderScreen();
  expect(textOf(root)).toContain('to be cleared');

  pressButton(root, 'clear-logs');

  expect(textOf(root)).toContain('No log entries yet.');
  expect(logger.getEntries()).toHaveLength(0);
});
