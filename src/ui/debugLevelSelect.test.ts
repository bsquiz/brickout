import { createDebugLevelOptions, parseDebugLevelIndex } from './debugLevelSelect';

describe('debug level selection', () => {
  test('creates numbered labels and falls back for untitled stages', () => {
    expect(createDebugLevelOptions(2, ['First Contact'])).toEqual([
      { index: 0, label: 'Level 1 · First Contact' },
      { index: 1, label: 'Level 2 · Untitled stage' }
    ]);
  });

  test('accepts only an available zero-based level index', () => {
    expect(parseDebugLevelIndex('9', 10)).toBe(9);
    expect(parseDebugLevelIndex('10', 10)).toBe(0);
    expect(parseDebugLevelIndex('nope', 10)).toBe(0);
  });
});
