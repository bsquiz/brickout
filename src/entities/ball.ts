import { Constants } from '../constants';
import { getBallSpeed, getDefaultArena } from '../gameplay/arena';
import type { ArenaDimensions, Ball, Paddle } from '../gameplay/types';

export const createBall = (paddle: Paddle): Ball => ({
  x: paddle.x + paddle.width / 2 - Constants.Entities.Ball.SIZE / 2,
  y: paddle.y - Constants.Entities.Ball.SIZE,
  width: Constants.Entities.Ball.SIZE,
  height: Constants.Entities.Ball.SIZE,
  velocity: { x: 0, y: 0 },
  launched: false,
  pendingLaunchDirection: 'angled',
  isSuper: false,
  perfectSuper: false,
  isCharged: false,
  trail: [],
  portalCooldown: 0,
  frozenSlowRemaining: 0,
  boostSpeedRemaining: 0
});

export const attachBallToPaddle = (ball: Ball, paddle: Paddle): void => {
  ball.x = paddle.x + paddle.width / 2 - ball.width / 2;
  ball.y = paddle.y - ball.height;
};

export const launchBall = (ball: Ball, arena: ArenaDimensions = getDefaultArena(), horizontalAim: number = Constants.Game.Serve.DEFAULT_AIM): void => {
  if (ball.launched) return;
  const speed = getBallSpeed(arena);
  const horizontalVelocity = ball.pendingLaunchDirection === 'perpendicular'
    ? 0
    : speed * Math.max(-Constants.Game.Serve.MAX_HORIZONTAL_RATIO, Math.min(Constants.Game.Serve.MAX_HORIZONTAL_RATIO, horizontalAim));
  ball.velocity = { x: horizontalVelocity, y: -speed };
  ball.launched = true;
  ball.pendingLaunchDirection = 'angled';
};
