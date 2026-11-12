import { getBrickScore, getRallyMultiplier } from './scoring';

describe('rally scoring', () => {
  test('raises the multiplier every three uninterrupted brick hits', () => {
    expect(getRallyMultiplier(1)).toBe(1);
    expect(getRallyMultiplier(4)).toBe(2);
    expect(getRallyMultiplier(20)).toBe(5);
  });

  test('combines rally and timed combo multipliers', () => {
    expect(getBrickScore(10, 3, 4)).toBe(60);
  });
});
