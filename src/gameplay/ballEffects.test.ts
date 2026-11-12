import { Constants } from '../constants';
import { createTestBall } from '../test/fixtures';
import { applyFrozenSlow, getBallMovementScale, updateBallEffects } from './ballEffects';

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
});
