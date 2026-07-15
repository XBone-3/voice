import { logger } from '@logger';
import { IS_DEV } from '@env';

afterEach(() => {
  logger.clear();
  jest.restoreAllMocks();
});

test('records an entry with the correct level, tag, and message', () => {
  logger.info('Test', 'hello');
  const entries = logger.getEntries();

  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    level: 'info',
    tag: 'Test',
    message: 'hello',
  });
  expect(typeof entries[0].timestamp).toBe('number');
});

test('debug/warn/error each record their own level', () => {
  logger.debug('Test', 'a');
  logger.warn('Test', 'b');
  logger.error('Test', 'c');

  const levels = logger.getEntries().map(entry => entry.level);
  expect(levels).toEqual(['debug', 'warn', 'error']);
});

test('optional data is attached to the entry', () => {
  logger.info('Test', 'with data', { count: 3 });
  expect(logger.getEntries()[0].data).toEqual({ count: 3 });
});

test('clear() empties the buffer', () => {
  logger.info('Test', 'one');
  logger.clear();
  expect(logger.getEntries()).toHaveLength(0);
});

test('getEntries() returns a copy, not a live reference', () => {
  logger.info('Test', 'one');
  const entries = logger.getEntries();
  entries.push({ timestamp: 0, level: 'debug', tag: 'x', message: 'mutated' });

  expect(logger.getEntries()).toHaveLength(1);
});

test('the buffer evicts the oldest entry once it exceeds capacity (200)', () => {
  for (let i = 0; i < 205; i++) {
    logger.info('Test', `entry-${i}`);
  }

  const entries = logger.getEntries();
  expect(entries).toHaveLength(200);
  expect(entries[0].message).toBe('entry-5');
  expect(entries[entries.length - 1].message).toBe('entry-204');
});

test('mirrors to console in dev builds', () => {
  if (!IS_DEV) {
    return;
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  logger.error('Test', 'boom');
  expect(spy).toHaveBeenCalledWith('[Test] boom', '');
});
