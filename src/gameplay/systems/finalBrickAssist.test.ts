import { createTestBall, createTestBrick, createTestGameState } from '../../test/fixtures';
import { applyFinalBrickAimAssist, getFinalTarget, intersectsBrickTarget, intersectsFinalTarget } from './finalBrickAssist';

describe('final brick assist', () => {
  test('only selects a target when one clearable brick remains', () => {
    const target = createTestBrick();
    const state = createTestGameState({ bricks: [target] });
    expect(getFinalTarget(state)).toBe(target);
    state.bricks.push(createTestBrick({ x: 100, baseX: 100 }));
    expect(getFinalTarget(state)).toBeNull();
  });

  test('steers toward the target while preserving ball speed', () => {
    const ball = createTestBall({ x: 250, y: 300, velocity: { x: 0, y: -240 } });
    const state = createTestGameState({
      ball,
      bricks: [createTestBrick({ x: 0, baseX: 0 })],
      finalTargetTurns: 8
    });
    applyFinalBrickAimAssist(state, ball);
    expect(ball.velocity.x).toBeLessThan(0);
    expect(ball.velocity.y).toBeLessThan(0);
    expect(Math.hypot(ball.velocity.x, ball.velocity.y)).toBeCloseTo(240);
  });

  test('adds collision padding only to the final target', () => {
    const target = createTestBrick({ x: 100, y: 100, baseX: 100 });
    const ball = createTestBall({ x: 85, y: 95 });
    const state = createTestGameState({ ball, bricks: [target] });
    expect(intersectsFinalTarget(state, ball, target)).toBe(true);
    state.bricks.push(createTestBrick({ x: 300, y: 100, baseX: 300 }));
    expect(intersectsFinalTarget(state, ball, target)).toBe(false);
    expect(intersectsBrickTarget(ball, target, null)).toBe(false);
    expect(intersectsBrickTarget(ball, target, target)).toBe(true);
  });
});
