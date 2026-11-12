import { updateAlienActor } from './alien/actor';
import { updateEnemyBullets } from './alien/bullets';
import type { GameState } from './types';

export { hitAlienWithBall, hitAlienWithProjectile } from './alien/combat';

export const updateAlienThreat = (state: GameState, deltaSeconds: number): boolean => {
  updateAlienActor(state, deltaSeconds);
  return updateEnemyBullets(state, deltaSeconds);
};
