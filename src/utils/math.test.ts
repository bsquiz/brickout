import { clamp, clamp01 } from './math';

describe('math utilities', () => {
  test('clamps values to an arbitrary range', () => {
    expect(clamp(-2, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
    expect(clamp(8, 0, 5)).toBe(5);
  });

  test('clamps normalized values between zero and one', () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(2)).toBe(1);
  });
});
