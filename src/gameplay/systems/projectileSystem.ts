import { Constants } from '../../constants';
import { intersects } from '../collisions';
import { hitAlienWithProjectile } from '../updateAlien';
import type { GameState, Projectile } from '../types';
import { hitBrick } from './brickSystem';

const createLaserShot = (state: GameState): void => {
  const createProjectile = (x: number): Projectile => ({
    x,
    y: state.paddle.y - Constants.Entities.Projectile.HEIGHT,
    width: Constants.Entities.Projectile.WIDTH,
    height: Constants.Entities.Projectile.HEIGHT
  });
  state.projectiles.push(createProjectile(state.paddle.x + 8), createProjectile(state.paddle.x + state.paddle.width - 12));
  state.events.push(Constants.Id.GameEvent.LASER);
};

export const updateProjectiles = (state: GameState, deltaSeconds: number): void => {
  if (state.activeEffects.laserRemaining > 0) {
    state.activeEffects.laserCooldown -= deltaSeconds;
    if (state.activeEffects.laserCooldown <= 0) {
      createLaserShot(state);
      state.activeEffects.laserCooldown = Constants.Entities.Projectile.FIRE_INTERVAL_SECONDS;
    }
  }
  const remaining: Projectile[] = [];
  for (const projectile of state.projectiles) {
    projectile.y -= Constants.Entities.Projectile.SPEED * deltaSeconds;
    if (hitAlienWithProjectile(state, projectile)) continue;
    const brickIndex = state.bricks.findIndex((brick) => intersects(projectile, brick));
    if (brickIndex >= 0) hitBrick(state, brickIndex);
    else if (projectile.y + projectile.height >= state.arena.hudHeight) remaining.push(projectile);
  }
  state.projectiles = remaining;
};
