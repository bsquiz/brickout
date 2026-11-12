import { Constants } from '../constants';
import type { Ball, Brick } from './types';

export const isClearTarget = (brick: Pick<Brick, 'behavior'>): boolean =>
  brick.behavior !== Constants.Id.BrickBehavior.INDESTRUCTIBLE && brick.behavior !== Constants.Id.BrickBehavior.PORTAL;

export const isDamageableBrick = (brick: Pick<Brick, 'behavior'>): boolean => isClearTarget(brick);

export const isDirectionalHitAllowed = (brick: Pick<Brick, 'behavior' | 'direction'>, ball: Pick<Ball, 'velocity'>): boolean => {
  if (brick.behavior !== Constants.Id.BrickBehavior.DIRECTIONAL) return true;
  if (brick.direction === Constants.Id.BrickDirection.LEFT) return ball.velocity.x > 0;
  if (brick.direction === Constants.Id.BrickDirection.RIGHT) return ball.velocity.x < 0;
  if (brick.direction === Constants.Id.BrickDirection.UP) return ball.velocity.y > 0;
  return ball.velocity.y < 0;
};
