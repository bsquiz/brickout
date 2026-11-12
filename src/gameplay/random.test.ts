import { nextRandom } from './random';

describe('seeded random source', () => {
  test('replays the same sequence from the same seed', () => {
    const first = { randomSeed: 12345 };
    const second = { randomSeed: 12345 };
    expect([nextRandom(first), nextRandom(first), nextRandom(first)]).toEqual([
      nextRandom(second), nextRandom(second), nextRandom(second)
    ]);
  });

  test('returns normalized values', () => {
    const state = { randomSeed: 98765 };
    expect(nextRandom(state)).toBeGreaterThanOrEqual(0);
    expect(nextRandom(state)).toBeLessThan(1);
  });
});
