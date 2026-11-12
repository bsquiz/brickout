import { PowerupRegistry } from './powerup';
import { createTestGameState } from '../test/fixtures';

describe('PowerupRegistry', () => {
  test('uses a distinct shape for every powerup type', () => {
    const shapes = Object.values(PowerupRegistry).map((definition) => definition.shape);
    expect(new Set(shapes).size).toBe(shapes.length);
  });

  test('creates two independently moving balls for multiball', () => {
    const state = createTestGameState();
    PowerupRegistry.multiball.apply(state);
    expect(state.extraBalls).toHaveLength(2);
    expect(state.extraBalls[0]?.velocity.x).toBeLessThan(0);
    expect(state.extraBalls[1]?.velocity.x).toBeGreaterThan(0);
  });

  test('activates timed effects and stacks shields', () => {
    const state = createTestGameState();
    PowerupRegistry.sticky.apply(state);
    PowerupRegistry['slow-motion'].apply(state);
    PowerupRegistry.laser.apply(state);
    PowerupRegistry.shield.apply(state);
    PowerupRegistry.shield.apply(state);
    expect(state.activeEffects.stickyRemaining).toBeGreaterThan(0);
    expect(state.activeEffects.slowMotionRemaining).toBeGreaterThan(0);
    expect(state.activeEffects.laserRemaining).toBeGreaterThan(0);
    expect(state.activeEffects.shieldCharges).toBe(2);
  });

  test('adds score powerups cumulatively and updates the high score', () => {
    const state = createTestGameState({ score: 50, highScore: 50 });
    PowerupRegistry['score-100'].apply(state);
    PowerupRegistry['score-200'].apply(state);
    PowerupRegistry['score-500'].apply(state);
    expect(state.score).toBe(850);
    expect(state.highScore).toBe(850);
  });
});
