import { createTestBall } from '../test/fixtures';
import { Constants } from '../constants';
import { getBallGlowColor, getBallSpriteFrame } from './ball';

describe('ball sprite selection', () => {
  test('maps normal, super, and charged balls from left to right', () => {
    expect(getBallSpriteFrame(createTestBall())).toBe(0);
    expect(getBallSpriteFrame(createTestBall({ isSuper: true }))).toBe(1);
    expect(getBallSpriteFrame(createTestBall({ isCharged: true }))).toBe(2);
  });

  test('charged artwork takes priority over super artwork', () => {
    expect(getBallSpriteFrame(createTestBall({ isSuper: true, isCharged: true }))).toBe(2);
  });

  test('uses an icy glow while the ball is slowed by a frozen brick', () => {
    const ball = createTestBall({ frozenSlowRemaining: 1, isCharged: true });

    expect(getBallGlowColor(ball, false)).toBe(Constants.Render.Colors.FROZEN_BALL);
  });

  test('uses a warm glow while the ball is accelerated by a boost brick', () => {
    const ball = createTestBall({ boostSpeedRemaining: 1 });

    expect(getBallGlowColor(ball, false)).toBe(Constants.Render.Colors.BOOSTED_BALL);
  });
});
