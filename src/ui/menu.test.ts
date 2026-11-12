import { formatHighScore, getInputMode, getMenuControlHint } from './menu';

describe('menu presentation', () => {
  test('uses concise touch instructions for touch-capable devices', () => {
    expect(getInputMode(true, 0)).toBe('touch');
    expect(getInputMode(false, 1)).toBe('touch');
    expect(getMenuControlHint('touch')).toBe('Drag to move · Tap to launch');
  });

  test('uses keyboard instructions when touch input is unavailable', () => {
    expect(getInputMode(false, 0)).toBe('keyboard');
    expect(getMenuControlHint('keyboard')).toBe('← → move · Double-tap boost · Space launch');
  });

  test('formats stored high scores for display', () => {
    expect(formatHighScore(1380)).toBe('1,380');
    expect(formatHighScore(-4)).toBe('0');
  });
});
