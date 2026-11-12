import { Constants } from '../constants';
import { createTestBall } from '../test/fixtures';
import { applyBoostSpeed, applyFrozenSlow, getBallMovementScale, updateBallEffects } from './ballEffects';

describe('temporary ball effects', () => {
  test('slows a frozen ball until its timer expires', () => {
    const ball = createTestBall();

    applyFrozenSlow(ball);

    expect(ball.frozenSlowRemaining).toBe(Constants.Game.Brick.Frozen.SLOW_DURATION_SECONDS);
    expect(getBallMovementScale(ball)).toBe(Constants.Game.Brick.Frozen.BALL_SPEED_SCALE);

    updateBallEffects(ball, Constants.Game.Brick.Frozen.SLOW_DURATION_SECONDS);
    expect(ball.frozenSlowRemaining).toBe(0);
    expect(getBallMovementScale(ball)).toBe(1);
  });

  test('refreshes rather than stacks repeated frozen hits', () => {
    const ball = createTestBall({ frozenSlowRemaining: 1 });

    applyFrozenSlow(ball);

    expect(ball.frozenSlowRemaining).toBe(Constants.Game.Brick.Frozen.SLOW_DURATION_SECONDS);
  });

  test('speeds up a boosted ball until its timer expires', () => {
    const ball = createTestBall();

    applyBoostSpeed(ball);

    expect(ball.boostSpeedRemaining).toBe(Constants.Game.Brick.Boost.SPEED_DURATION_SECONDS);
    expect(getBallMovementScale(ball)).toBe(Constants.Game.Brick.Boost.BALL_SPEED_SCALE);

    updateBallEffects(ball, Constants.Game.Brick.Boost.SPEED_DURATION_SECONDS);
    expect(getBallMovementScale(ball)).toBe(1);
  });

  test('replaces the opposing temporary speed effect', () => {
    const ball = createTestBall();

    applyFrozenSlow(ball);
    applyBoostSpeed(ball);
    expect(ball.frozenSlowRemaining).toBe(0);
    expect(ball.boostSpeedRemaining).toBeGreaterThan(0);

    applyFrozenSlow(ball);
    expect(ball.boostSpeedRemaining).toBe(0);
    expect(ball.frozenSlowRemaining).toBeGreaterThan(0);
  });
});
