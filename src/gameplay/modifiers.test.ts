import { getStageModifier, StageModifierRegistry } from './modifiers';

describe('stage modifiers', () => {
  test('rotates through a deterministic modifier cycle', () => {
    expect(getStageModifier(0)).toBe('standard');
    expect(getStageModifier(1)).toBe('low-gravity');
    expect(getStageModifier(5)).toBe('standard');
  });

  test('provides player-facing details for every modifier', () => {
    expect(StageModifierRegistry.blackout.description).toContain('ball');
  });
});
