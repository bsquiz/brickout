import { createLevelStats, gradeLevel } from './grading';

describe('level grading', () => {
  test('awards S rank for a fast, flawless, skilled clear', () => {
    const stats = createLevelStats(0, 3, 100);
    stats.maxCombo = 10;
    stats.maxHeat = 8;
    stats.skillShots = ['opening-blitz', 'bank-master', 'overdrive'];
    expect(gradeLevel(stats, 20, 3, 1000, 20).grade).toBe('S');
  });

  test('penalizes slow clears and lost lives', () => {
    const stats = createLevelStats(0, 3, 0);
    expect(gradeLevel(stats, 200, 1, 100, 10).grade).toBe('C');
  });
});
