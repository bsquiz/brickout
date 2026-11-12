import type { Rectangle } from './types';

export type CollisionAxis = 'horizontal' | 'vertical';

export const intersects = (first: Rectangle, second: Rectangle): boolean =>
  first.x < second.x + second.width &&
  first.x + first.width > second.x &&
  first.y < second.y + second.height &&
  first.y + first.height > second.y;

export const getCollisionAxis = (moving: Rectangle, target: Rectangle): CollisionAxis => {
  const overlapLeft = moving.x + moving.width - target.x;
  const overlapRight = target.x + target.width - moving.x;
  const overlapTop = moving.y + moving.height - target.y;
  const overlapBottom = target.y + target.height - moving.y;
  const horizontalOverlap = Math.min(overlapLeft, overlapRight);
  const verticalOverlap = Math.min(overlapTop, overlapBottom);
  return horizontalOverlap < verticalOverlap ? 'horizontal' : 'vertical';
};
