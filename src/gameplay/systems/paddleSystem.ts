import { Constants } from '../../constants';
import type { GameState, InputState } from '../types';
import { clamp } from '../../utils/math';

export const movePaddle = (state: GameState, input: InputState, deltaSeconds: number): void => {
  const previousX = state.paddle.x;
  const maximumMovement = Constants.Entities.Paddle.SPEED * deltaSeconds;
  let movementDirection = Number(input.right) - Number(input.left);
  if (!state.ball.launched) movementDirection = 0;
  if (input.paddleTargetX !== null) {
    const targetLeft = input.paddleTargetX - state.paddle.width / 2;
    const distance = targetLeft - state.paddle.x;
    movementDirection = Math.sign(distance);
    state.paddle.x += Math.sign(distance) * Math.min(Math.abs(distance), maximumMovement);
  } else state.paddle.x += movementDirection * maximumMovement;
  if (input.dash && state.dashCooldown === 0) {
    const ballCenter = state.ball.x + state.ball.width / 2;
    const paddleCenter = state.paddle.x + state.paddle.width / 2;
    state.paddle.x += (movementDirection || Math.sign(ballCenter - paddleCenter) || 1) * Constants.Game.DASH_DISTANCE;
    state.dashCooldown = Constants.Game.DASH_COOLDOWN_SECONDS;
    state.effects.shake = state.reducedMotion ? 0 : 3;
  }
  state.paddle.x = clamp(state.paddle.x, 0, state.arena.width - state.paddle.width);
  state.paddleVelocityX = deltaSeconds > 0 ? (state.paddle.x - previousX) / deltaSeconds : 0;
};
