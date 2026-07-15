import { getAndroidVersion } from '@services/bridgeInfo';
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
