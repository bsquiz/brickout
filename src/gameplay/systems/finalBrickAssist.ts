import { Constants } from '../../constants';
import { intersects } from '../collisions';
import { isClearTarget } from '../brickRules';
import type { Ball, Brick, GameState } from '../types';

export const getFinalTarget = (state: GameState): Brick | null => {
  let target: Brick | null = null;
  for (const brick of state.bricks) {
    if (!isClearTarget(brick)) continue;
    if (target !== null) return null;
    target = brick;
  }
  return target;
};

export const applyFinalBrickAimAssist = (state: GameState, ball: Ball): void => {
  const target = getFinalTarget(state);
  if (target === null) return;

  const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
  const targetX = target.x + target.width / 2 - (ball.x + ball.width / 2);
  const targetY = target.y + target.height / 2 - (ball.y + ball.height / 2);
  const distance = Math.hypot(targetX, targetY);
  if (speed === 0 || distance === 0) return;

  const progress = Math.min(1, state.finalTargetTurns / Constants.Game.AimAssist.TURNS_TO_MAX);
  const strength = Constants.Game.AimAssist.MIN_STRENGTH +
    (Constants.Game.AimAssist.MAX_STRENGTH - Constants.Game.AimAssist.MIN_STRENGTH) * progress;
  const assistedX = ball.velocity.x * (1 - strength) + (targetX / distance) * speed * strength;
  const assistedY = ball.velocity.y * (1 - strength) + (targetY / distance) * speed * strength;
  const assistedSpeed = Math.hypot(assistedX, assistedY);
  if (assistedSpeed === 0) return;

  ball.velocity.x = assistedX * (speed / assistedSpeed);
  ball.velocity.y = -Math.abs(assistedY * (speed / assistedSpeed));
};

export const intersectsBrickTarget = (ball: Ball, brick: Brick, finalTarget: Brick | null): boolean => {
  if (finalTarget !== brick) return intersects(ball, brick);
  const padding = Constants.Game.AimAssist.FINAL_BRICK_HITBOX_PADDING;
  return intersects(ball, {
    x: brick.x - padding,
    y: brick.y - padding,
    width: brick.width + padding * 2,
    height: brick.height + padding * 2
  });
};

export const intersectsFinalTarget = (state: GameState, ball: Ball, brick: Brick): boolean =>
  intersectsBrickTarget(ball, brick, getFinalTarget(state));
