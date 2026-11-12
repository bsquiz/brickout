import { Id } from './identifiers';

describe('domain identifiers', () => {
  test.each(Object.entries(Id))('%s contains unique values', (_domain, identifiers) => {
    const values = Object.values(identifiers);
    expect(new Set(values).size).toBe(values.length);
  });

  test('keeps behavior-driving identifiers available at runtime', () => {
    expect(Object.values(Id.PowerupType)).toContain('score-500');
    expect(Object.values(Id.BrickBehavior)).toContain('explosive');
    expect(Object.values(Id.GameEvent)).toContain('life-lost');
    expect(Object.values(Id.GamePhase)).toContain('playing');
  });
});
