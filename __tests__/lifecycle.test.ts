import { isInForeground, subscribeToLifecycle } from '@services/lifecycle';
import { logger } from '@logger';

afterEach(() => {
  logger.clear();
});

test('isInForeground returns null and logs a warning when the native module is not linked (Jest/Node)', async () => {
  const result = await isInForeground();

  expect(result).toBeNull();
  const entries = logger.getEntries();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    level: 'warn',
    tag: 'lifecycle',
  });
});

test('subscribeToLifecycle logs a warning and returns a no-op unsubscribe when the native module is not linked (Jest/Node)', () => {
  const callback = jest.fn();
  const unsubscribe = subscribeToLifecycle(callback);

  expect(callback).not.toHaveBeenCalled();
  const entries = logger.getEntries();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    level: 'warn',
    tag: 'lifecycle',
  });

  expect(() => unsubscribe()).not.toThrow();
});
