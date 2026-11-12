import { Constants } from '../constants';
import { createTestBrick, createTestGameState } from '../test/fixtures';
import { spawnBrickEffects, spawnBrickHitEffects, spawnPowerupEffects, updateVisualEffects } from './effects';

describe('gameplay animation effects', () => {
  test('creates an inward shockwave for a destroyed portal brick', () => {
    const state = createTestGameState();
    spawnBrickEffects(state, createTestBrick({ behavior: 'portal', portalId: 'test' }), 10);
    expect(state.effects.shockwaves[0]?.speed).toBeLessThan(0);
  });

  test('creates a restrained particle burst for a damaged brick', () => {
    const state = createTestGameState();
    spawnBrickHitEffects(state, createTestBrick({ hitPoints: 2, maxHitPoints: 3 }));

    expect(state.effects.particles).toHaveLength(Constants.Animation.Brick.HIT_PARTICLE_COUNT);
    expect(state.effects.particles.every((particle) => particle.life <= 0.34 && particle.size <= 3)).toBe(true);
  });

  test('spirals collected power-up sparks toward the player', () => {
    const state = createTestGameState();
    spawnPowerupEffects(state, 'expand', 'Paddle expand', '#4ade80', { x: 20, y: 120 });
    expect(state.effects.vortexSparks).toHaveLength(Constants.Animation.Vortex.SPARK_COUNT);
    const initialRadius = state.effects.vortexSparks[0]?.radius ?? 0;
    updateVisualEffects(state, 0.1);
    expect(state.effects.vortexSparks[0]?.radius).toBeLessThan(initialRadius);
  });

  test('decays impact and near-miss animation intensity', () => {
    const state = createTestGameState();
    state.effects.ballImpact = 1;
    state.effects.nearMissGlow = 1;
    updateVisualEffects(state, 0.1);
    expect(state.effects.ballImpact).toBeLessThan(1);
    expect(state.effects.nearMissGlow).toBeLessThan(1);
  });
});
