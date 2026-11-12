import { Constants } from '../constants';
import type { Ball } from './types';

export const applyFrozenSlow = (ball: Ball): void => {
  ball.frozenSlowRemaining = Math.max(
    ball.frozenSlowRemaining,
    Constants.Game.Brick.Frozen.SLOW_DURATION_SECONDS
  );
};

export const getBallMovementScale = (ball: Pick<Ball, 'frozenSlowRemaining'>): number =>
  ball.frozenSlowRemaining > 0 ? Constants.Game.Brick.Frozen.BALL_SPEED_SCALE : 1;

export const updateBallEffects = (ball: Ball, deltaSeconds: number): void => {
  ball.frozenSlowRemaining = Math.max(0, ball.frozenSlowRemaining - deltaSeconds);
};
