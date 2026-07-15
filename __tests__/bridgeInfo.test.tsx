import {
  getAndroidVersion,
  subscribeToMemoryPressure,
} from '@services/bridgeInfo';
import { logger } from '@logger';

afterEach(() => {
  logger.clear();
});

test('returns null and logs a warning when the native module is not linked (Jest/Node)', async () => {
  const result = await getAndroidVersion();

  expect(result).toBeNull();
  const entries = logger.getEntries();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    level: 'warn',
    tag: 'bridgeInfo',
  });
});

test('subscribeToMemoryPressure logs a warning and returns a no-op unsubscribe when the native module is not linked (Jest/Node)', () => {
  const callback = jest.fn();
  const unsubscribe = subscribeToMemoryPressure(callback);

  expect(callback).not.toHaveBeenCalled();
  const entries = logger.getEntries();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    level: 'warn',
    tag: 'bridgeInfo',
  });

  expect(() => unsubscribe()).not.toThrow();
});
