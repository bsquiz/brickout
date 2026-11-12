import { Constants } from '../constants';
import { shouldPlayMusic } from './audioService';
import { getEventFrequencies, getSoundRecipe } from './soundRecipes';

describe('gameplay audio notes', () => {
  test('varies brick notes by row and combo', () => {
    expect(getEventFrequencies('brick-hit', 1, 0)).toEqual([Constants.Audio.Frequency.BRICK + 18]);
    expect(getEventFrequencies('brick-hit', 1, 1)[0]).toBeGreaterThan(getEventFrequencies('brick-hit', 1, 0)[0] ?? 0);
  });

  test('resolves level completion as a chord', () => {
    expect(getEventFrequencies('level-won', 0, 0)).toHaveLength(3);
  });

  test('uses filtered noise for destructive impacts', () => {
    expect(getSoundRecipe('alien-hit', 0, 0).noise).toBeDefined();
    expect(getSoundRecipe('life-lost', 0, 0).noise).toBeDefined();
    expect(getSoundRecipe('paddle-hit', 0, 0).noise).toBeUndefined();
  });

  test('builds an ascending powerup arpeggio', () => {
    const frequencies = getEventFrequencies('powerup', 0, 0);
    expect(frequencies).toEqual([...frequencies].sort((first, second) => first - second));
    expect(frequencies).toHaveLength(3);
  });

  test('plays background music only during active gameplay', () => {
    expect(shouldPlayMusic('countdown')).toBe(true);
    expect(shouldPlayMusic('playing')).toBe(true);
    expect(shouldPlayMusic('life-lost')).toBe(true);
    expect(shouldPlayMusic('level-won')).toBe(true);
    expect(shouldPlayMusic('upgrade')).toBe(true);
    expect(shouldPlayMusic('paused')).toBe(false);
    expect(shouldPlayMusic('menu')).toBe(false);
    expect(shouldPlayMusic('game-over')).toBe(false);
  });
});
