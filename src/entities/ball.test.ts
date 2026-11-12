import { Constants } from '../constants';
import { createTestPaddle } from '../test/fixtures';
import { createBall, launchBall } from './ball';

describe('ball launch direction', () => {
  test('uses the normal angled trajectory for a new ball', () => {
    const ball = createBall(createTestPaddle());
    launchBall(ball);
    expect(ball.velocity.x).toBeGreaterThan(0);
    expect(ball.velocity.y).toBe(-Constants.Entities.Ball.SPEED);
  });

  test('launches perpendicular after a sticky catch', () => {
    const ball = createBall(createTestPaddle());
    ball.pendingLaunchDirection = 'perpendicular';
    launchBall(ball);
    expect(ball.velocity).toEqual({ x: 0, y: -Constants.Entities.Ball.SPEED });
    expect(ball.pendingLaunchDirection).toBe('angled');
  });

  test('launches toward a selected serve direction', () => {
    const ball = createBall(createTestPaddle());
    launchBall(ball, undefined, -0.6);
    expect(ball.velocity.x).toBeLessThan(0);
    expect(ball.velocity.y).toBe(-Constants.Entities.Ball.SPEED);
  });
});
