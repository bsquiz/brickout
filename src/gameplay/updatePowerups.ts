import { Constants } from '../constants';
import { PowerupRegistry } from '../entities';
import { intersects } from './collisions';
import { spawnPowerupEffects } from './effects';
import type { GameState, Powerup } from './types';

const collectPowerup = (state: GameState, powerup: Powerup): void => {
  const definition = PowerupRegistry[powerup.type];
  spawnPowerupEffects(state, powerup.type, definition.label, definition.color, {
    x: powerup.x + powerup.width / 2,
    y: powerup.y + powerup.height / 2
  });
  definition.apply(state);
  state.events.push(Constants.Id.GameEvent.POWERUP);
};

export const updatePowerups = (state: GameState, deltaSeconds: number): void => {
  const remaining: Powerup[] = [];
  const paddleCollectionBounds = { ...state.paddle };
  for (const powerup of state.powerups) {
    powerup.y += Constants.Entities.Powerup.SPEED * deltaSeconds;
    if (intersects(powerup, paddleCollectionBounds)) collectPowerup(state, powerup);
    else if (powerup.y <= state.arena.height) remaining.push(powerup);
  }
  state.powerups = remaining;
};
