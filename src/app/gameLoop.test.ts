import { getFrameDeltaSeconds } from './gameLoop';

describe('getFrameDeltaSeconds', () => {
  it('starts with a zero-length frame', () => {
    expect(getFrameDeltaSeconds(500, null)).toBe(0);
  });

  it('converts elapsed milliseconds to seconds', () => {
    expect(getFrameDeltaSeconds(1_250, 1_000)).toBe(0.25);
  });
});
