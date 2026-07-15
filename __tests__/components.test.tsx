import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { ThemeProvider } from '@theme';
import { lightTheme } from '@theme/light';
import { Screen, AppText, MenuLink, Card } from '@components';

function renderWithTheme(children: React.ReactElement) {
  let root: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    root = ReactTestRenderer.create(<ThemeProvider>{children}</ThemeProvider>);
  });
  return root!;
}

test('Screen applies the theme background color to its container', () => {
  const root = renderWithTheme(
    <Screen>
      <Text>content</Text>
    </Screen>,
  );

  const container = root.root.findByType('View' as never);
  const flattenedStyle = [container.props.style].flat();
  expect(flattenedStyle).toContainEqual(
    expect.objectContaining({ backgroundColor: lightTheme.colors.background }),
  );
});

test('AppText applies the requested typography variant', () => {
  const root = renderWithTheme(<AppText variant="titleLarge">Hello</AppText>);

  const text = root.root.findByType(Text);
  const flattenedStyle = [text.props.style].flat();
  expect(flattenedStyle).toContainEqual(
    expect.objectContaining(lightTheme.typography.titleLarge),
  );
});

test('MenuLink renders its label and calls onPress when pressed', () => {
  const onPress = jest.fn();
  const root = renderWithTheme(
    <MenuLink label="Settings" onPress={onPress} testID="settings-link" />,
  );

  expect(root.root.findByType(Text).props.children).toBe('Settings');

  act(() => {
    root.root.findByProps({ testID: 'settings-link' }).props.onPress();
  });
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('Card applies the theme surface color and elevation', () => {
  const root = renderWithTheme(
    <Card>
      <Text>content</Text>
    </Card>,
  );

  const container = root.root.findByType('View' as never);
  const flattenedStyle = [container.props.style].flat();
  expect(flattenedStyle).toContainEqual(
    expect.objectContaining({
      backgroundColor: lightTheme.colors.surface,
      elevation: lightTheme.elevation.level1,
    }),
  );
});
