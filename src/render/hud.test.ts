import { Constants } from '../constants';
import { createTestBrick, createTestGameState } from '../test/fixtures';
import { getComboProgress, getEffectIndicators, getRallyHeatProgress, getRemainingBrickRatio } from './hud';

describe('HUD level progress', () => {
  test('reports the share of breakable bricks remaining', () => {
    const state = createTestGameState({
      levelBrickCount: 4,
      bricks: [createTestBrick(), createTestBrick(), createTestBrick({ behavior: 'indestructible' })]
    });
    expect(getRemainingBrickRatio(state)).toBe(0.5);
  });

  test('clamps invalid and completed progress', () => {
    expect(getRemainingBrickRatio(createTestGameState({ levelBrickCount: 0, bricks: [] }))).toBe(0);
    expect(getRemainingBrickRatio(createTestGameState({ levelBrickCount: 1, bricks: [] }))).toBe(0);
  });

  test('reports normalized combo time remaining', () => {
    expect(getComboProgress(createTestGameState({ comboRemaining: Constants.Game.COMBO_WINDOW_SECONDS / 2 }))).toBe(0.5);
    expect(getComboProgress(createTestGameState({ comboRemaining: 99 }))).toBe(1);
  });

  test('reports rally heat progress', () => {
    expect(getRallyHeatProgress(createTestGameState({ returnStreak: Constants.Game.RallyHeat.MAX_RETURNS / 2 }))).toBe(0.5);
  });

  test('describes active power-up countdown rings', () => {
    const state = createTestGameState();
    state.activeEffects.stickyRemaining = Constants.Game.POWERUP_DURATION_SECONDS / 2;
    state.activeEffects.shieldCharges = 1;
    expect(getEffectIndicators(state)).toEqual([
      expect.objectContaining({ label: 'M', progress: 0.5 }),
      expect.objectContaining({ label: 'S', progress: 1 })
    ]);
  });
});
