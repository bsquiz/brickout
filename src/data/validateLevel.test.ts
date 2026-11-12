import { validateLevels } from './validateLevel';

describe('validateLevels', () => {
  test('normalizes valid brick definitions', () => {
    const row = Array.from({ length: 10 }, () => null);
    row[0] = { hitPoints: 2, powerup: 'expand' } as never;
    expect(validateLevels([[row]])[0]?.[0]?.[0]).toEqual({ hitPoints: 2, powerup: 'expand' });
  });

  test('rejects unknown powerups with a useful location', () => {
    const row = Array.from({ length: 10 }, () => null);
    row[3] = { powerup: 'teleport' } as never;
    expect(() => validateLevels([[row]])).toThrow('Unknown powerup at level 1, row 1, column 4');
  });

  test('accepts score bonus powerups', () => {
    const row = [{ powerup: 'score-100' }, { powerup: 'score-200' }, { powerup: 'score-500' }];
    expect(validateLevels([[row]])[0]?.[0]?.map((brick) => brick?.powerup)).toEqual(['score-100', 'score-200', 'score-500']);
  });

  test('accepts the ball speed-up powerup', () => {
    const row = [{ powerup: 'speed-up' }];

    expect(validateLevels([[row]])[0]?.[0]?.[0]?.powerup).toBe('speed-up');
  });

  test('rejects malformed row widths', () => {
    expect(() => validateLevels([[[null, null], [null]]])).toThrow('must contain exactly 2 cells');
  });

  test('supports levels with seven consistently sized columns', () => {
    const level = validateLevels([[Array.from({ length: 7 }, () => ({}))]])[0];
    expect(level?.[0]).toHaveLength(7);
  });

  test('rejects unknown brick behaviors', () => {
    const row = Array.from({ length: 10 }, () => null);
    row[0] = { behavior: 'teleporting' } as never;
    expect(() => validateLevels([[row]])).toThrow('Unknown brick behavior');
  });

  test('validates paired portals and directional faces', () => {
    const row = Array.from({ length: 10 }, () => null);
    row[0] = { behavior: 'portal', portalId: 'a' } as never;
    row[1] = { behavior: 'portal', portalId: 'a' } as never;
    row[2] = { behavior: 'directional', direction: 'left' } as never;
    expect(validateLevels([[row]])[0]?.[0]?.[2]).toEqual({ hitPoints: 1, behavior: 'directional', direction: 'left' });
  });

  test('rejects an unpaired portal', () => {
    const row = Array.from({ length: 10 }, () => null);
    row[0] = { behavior: 'portal', portalId: 'solo' } as never;
    expect(() => validateLevels([[row]])).toThrow('must contain exactly two bricks');
  });
});
