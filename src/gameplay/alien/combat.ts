import { Constants } from '../../constants';
import { createEnemyBullet, createPowerupAt, getAlienDefinition, getNextAlienSpawnDelay } from '../../entities';
import { intersects } from '../collisions';
import { spawnAlienEffects } from '../effects';
import type { Ball, GameState, Projectile } from '../types';

export const hitAlienWithBall = (state: GameState, ball: Ball): boolean => {
  const alien = state.alien;
  if (alien === null || !intersects(ball, alien)) return false;

  alien.hitPoints -= 1;
  const definition = getAlienDefinition(alien);
  state.alienHitSincePaddle = true;
  const defeated = alien.hitPoints <= 0;
  const points = definition.points;
  const centerX = alien.x + alien.width / 2;
  const centerY = alien.y + alien.height / 2;
  state.score += defeated ? points : Constants.Entities.Alien.POINTS;
  state.highScore = Math.max(state.highScore, state.score);
  if (!defeated) {
    ball.velocity.y = ball.velocity.y === 0 ? -Constants.Entities.Ball.SPEED : ball.velocity.y * -1;
    state.events.push(Constants.Id.GameEvent.ALIEN_HIT);
    state.effects.alienDamageFlash = 1;
    state.effects.ballImpact = 1;
    spawnAlienEffects(state, centerX, centerY, Constants.Entities.Alien.POINTS);
    return true;
  }

  state.alien = null;
  state.alienWarningSide = null;
  state.enemyBullets = [];
  state.alienSpawnRemaining = getNextAlienSpawnDelay();
  state.hitStopRemaining = state.reducedMotion ? 0 : Constants.Game.ALIEN_HIT_STOP_SECONDS;
  ball.velocity.y = ball.velocity.y === 0 ? -Constants.Entities.Ball.SPEED : ball.velocity.y * -1;
  state.events.push(Constants.Id.GameEvent.ALIEN_HIT);
  state.effects.ballImpact = 1;
  spawnAlienEffects(state, centerX, centerY, points);
  if (definition.deathEffect === 'split-shot') {
    state.enemyBullets.push(createEnemyBullet(alien, -110), createEnemyBullet(alien, 110));
  }
  if (definition.deathEffect === 'boss-reward') {
    state.bossDefeated = true;
    Constants.Spawn.PowerupDrops.BOSS.slice(0, Constants.Game.Boss.POWERUP_DROPS).forEach((type, index) => {
      state.powerups.push(createPowerupAt(
        centerX - Constants.Entities.Powerup.WIDTH / 2 +
          (index - 1) * (Constants.Entities.Powerup.WIDTH + Constants.Entities.Powerup.DROP_GAP),
        centerY,
        type
      ));
    });
  }
  return true;
};

export const hitAlienWithProjectile = (state: GameState, projectile: Projectile): boolean => {
  const previousBallImpact = state.effects.ballImpact;
  const laserImpact: Ball = {
    ...projectile,
    velocity: { x: 0, y: -Constants.Entities.Projectile.SPEED },
    launched: true,
    pendingLaunchDirection: 'perpendicular',
    isSuper: false,
    perfectSuper: false,
    isCharged: false,
    trail: [],
    portalCooldown: 0,
    frozenSlowRemaining: 0
  };
  const hit = hitAlienWithBall(state, laserImpact);
  state.effects.ballImpact = previousBallImpact;
  return hit;
};
