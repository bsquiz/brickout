import { Constants } from '../../constants';
import { createTestBall, createTestBrick, createTestGameState } from '../../test/fixtures';
import { hitBrick, updateBricks } from './brickSystem';

describe('brick system explosions', () => {
  test('temporarily slows the ball that hits a frozen brick', () => {
    const frozen = createTestBrick({ behavior: 'frozen' });
    const ball = createTestBall();
    const state = createTestGameState({ bricks: [frozen], ball });

    hitBrick(state, 0, ball);

    expect(ball.frozenSlowRemaining).toBe(Constants.Game.Brick.Frozen.SLOW_DURATION_SECONDS);
  });

  test('restores a regenerating brick after it survives damage', () => {
    const regenerating = createTestBrick({
      behavior: 'regenerating',
      hitPoints: Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS,
      maxHitPoints: Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS
    });
    const state = createTestGameState({ bricks: [regenerating] });

    hitBrick(state, 0);
    expect(regenerating.hitPoints).toBe(Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS - 1);

    state.elapsedSeconds = Constants.Game.Brick.REGENERATION_SECONDS + 0.01;
    updateBricks(state, 0);
    expect(regenerating.hitPoints).toBe(Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS);
  });

  test('emits small chip bursts each time a multi-hit brick survives damage', () => {
    const armored = createTestBrick({ behavior: 'armored', hitPoints: 3, maxHitPoints: 3 });
    const state = createTestGameState({ bricks: [armored] });

    hitBrick(state, 0);
    expect(armored.hitPoints).toBe(2);
    expect(state.effects.particles).toHaveLength(Constants.Animation.Brick.HIT_PARTICLE_COUNT);

    hitBrick(state, 0);
    expect(armored.hitPoints).toBe(1);
    expect(state.effects.particles).toHaveLength(Constants.Animation.Brick.HIT_PARTICLE_COUNT * 2);
  });

  test('destroys damageable bricks inside a bomb radius but preserves protected and distant bricks', () => {
    const bomb = createTestBrick({ x: 100, behavior: 'explosive' });
    const nearbyNormal = createTestBrick({ x: 150, baseX: 150 });
    const nearbyArmored = createTestBrick({ x: 100, y: 100, baseX: 100, behavior: 'armored', hitPoints: 3, maxHitPoints: 3 });
    const protectedBrick = createTestBrick({ x: 50, baseX: 50, behavior: 'indestructible' });
    const distantBrick = createTestBrick({ x: 300, baseX: 300 });
    const state = createTestGameState({ bricks: [bomb, nearbyNormal, nearbyArmored, protectedBrick, distantBrick] });

    hitBrick(state, 0);
    updateBricks(state, 1);

    expect(state.bricks).toEqual([protectedBrick, distantBrick]);
    expect(state.levelStats.bricksDestroyed).toBe(3);
  });

  test('allows bomb bricks to chain explosions beyond the first radius', () => {
    const firstBomb = createTestBrick({ x: 100, behavior: 'explosive' });
    const secondBomb = createTestBrick({ x: 150, baseX: 150, behavior: 'explosive' });
    const chainedTarget = createTestBrick({ x: 230, baseX: 230 });
    const state = createTestGameState({ bricks: [firstBomb, secondBomb, chainedTarget] });

    hitBrick(state, 0);
    updateBricks(state, 1);
    updateBricks(state, 1);

    expect(state.bricks).toHaveLength(0);
    expect(state.levelStats.bricksDestroyed).toBe(3);
  });
});
