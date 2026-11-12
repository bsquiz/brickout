import { getNextTrailStyle, getUnlockedTrailStyles } from './trail';

describe('trail unlocks', () => {
  test('unlocks styles at score milestones', () => {
    expect(getUnlockedTrailStyles(0)).toEqual(['classic']);
    expect(getUnlockedTrailStyles(1600)).toEqual(['classic', 'neon', 'ember']);
    expect(getUnlockedTrailStyles(3000)).toContain('rainbow');
  });

  test('cycles only through unlocked styles', () => {
    expect(getNextTrailStyle('classic', 600)).toBe('neon');
    expect(getNextTrailStyle('neon', 600)).toBe('classic');
  });
});
