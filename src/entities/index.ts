export { createAlien, createEnemyBullet, getAlienKind, getNextAlienSpawnDelay } from './alien';
export type { CreateAlienOptions } from './alien';
export { AlienRegistry, getAlienDefinition, StandardAlienKinds } from './alienRegistry';
export type { AlienDeathEffect, AlienDefinition, AlienWeapon } from './alienRegistry';
export { attachBallToPaddle, createBall, launchBall } from './ball';
export { createBricks } from './brick';
export { createPaddle, resetPaddle } from './paddle';
export { createPowerup, createPowerupAt, PowerupRegistry } from './powerup';
export type { PowerupShape } from './powerup';
