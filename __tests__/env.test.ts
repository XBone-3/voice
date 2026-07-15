import { FEATURES, IS_DEV } from '@env';

test('IS_DEV reflects the React Native __DEV__ global', () => {
  expect(IS_DEV).toBe(__DEV__);
});

test('developer and diagnostics screens follow IS_DEV', () => {
  expect(FEATURES.developer).toBe(IS_DEV);
  expect(FEATURES.diagnostics).toBe(IS_DEV);
});

test('unbuilt-engine screens default to disabled', () => {
  expect(FEATURES.assistant).toBe(false);
  expect(FEATURES.notifications).toBe(false);
  expect(FEATURES.automation).toBe(false);
  expect(FEATURES.memory).toBe(false);
  expect(FEATURES.history).toBe(false);
  expect(FEATURES.plugins).toBe(false);
});
