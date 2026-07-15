import { checkPermission, requestPermission } from '@services/permissions';
import { logger } from '@logger';

afterEach(() => {
  logger.clear();
});

test('checkPermission returns false and logs a warning when the native module is not linked (Jest/Node)', async () => {
  const result = await checkPermission('android.permission.RECORD_AUDIO');

  expect(result).toBe(false);
  const entries = logger.getEntries();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    level: 'warn',
    tag: 'permissions',
  });
});

test('requestPermission returns false and logs a warning when the native module is not linked (Jest/Node)', async () => {
  const result = await requestPermission('android.permission.RECORD_AUDIO');

  expect(result).toBe(false);
  const entries = logger.getEntries();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    level: 'warn',
    tag: 'permissions',
  });
});
