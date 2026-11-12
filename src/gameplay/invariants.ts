import type { GameState, Rectangle } from './types';

const isFiniteRectangle = (rectangle: Rectangle): boolean =>
  [rectangle.x, rectangle.y, rectangle.width, rectangle.height].every(Number.isFinite) && rectangle.width > 0 && rectangle.height > 0;

export const getStateInvariantErrors = (state: GameState): string[] => {
  const errors: string[] = [];
  if (state.arena.width <= 0 || state.arena.height <= state.arena.hudHeight) errors.push('invalid arena');
  if (!isFiniteRectangle(state.ball)) errors.push('invalid ball');
  if (!isFiniteRectangle(state.paddle)) errors.push('invalid paddle');
  if (![...state.bricks, ...state.powerups, ...state.projectiles, ...state.enemyBullets].every(isFiniteRectangle)) errors.push('invalid entity');
  if (![state.score, state.lives, state.elapsedSeconds].every(Number.isFinite)) errors.push('invalid game scalar');
  return errors;
};
