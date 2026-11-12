import { Constants } from '../../constants';
import { intersects } from '../collisions';
import { spawnNearMissEffects } from '../effects';
import type { Ball, EnemyBullet, GameState } from '../types';
import { hitAlienWithBall } from './combat';

const hitAlienWithReflectedBullet = (state: GameState, bullet: EnemyBullet): boolean => {
  const reflectedBall: Ball = {
    x: bullet.x,
    y: bullet.y,
    width: bullet.width,
    height: bullet.height,
    velocity: { x: bullet.velocityX, y: bullet.velocityY },
    launched: true,
    pendingLaunchDirection: 'angled',
    isSuper: false,
    perfectSuper: false,
    isCharged: true,
    trail: [],
    portalCooldown: 0,
    frozenSlowRemaining: 0,
    boostSpeedRemaining: 0
  };
  hitAlienWithBall(state, reflectedBall);
  return state.alien === null;
};

const awardNearMiss = (state: GameState, bullet: EnemyBullet): void => {
  const player = state.paddle;
  if (bullet.reflected || bullet.y <= player.y + player.height || bullet.nearMissAwarded) return;
  const bulletCenter = bullet.x + bullet.width / 2;
  const targetCenter = player.x + player.width / 2;
  const edgeDistance = Math.abs(bulletCenter - targetCenter) - player.width / 2;
  if (edgeDistance > Constants.Game.NearMiss.DISTANCE) return;
  bullet.nearMissAwarded = true;
  state.score += Constants.Game.NearMiss.POINTS;
  state.highScore = Math.max(state.highScore, state.score);
  state.events.push(Constants.Id.GameEvent.NEAR_MISS);
  spawnNearMissEffects(state, bulletCenter, player.y);
};

const isBulletVisible = (state: GameState, bullet: EnemyBullet): boolean =>
  bullet.y <= state.arena.height &&
  bullet.y + bullet.height >= state.arena.hudHeight &&
  bullet.x + bullet.width >= 0 &&
  bullet.x <= state.arena.width;

export const updateEnemyBullets = (state: GameState, deltaSeconds: number): boolean => {
  const remainingBullets: EnemyBullet[] = [];
  let playerWasHit = false;
  let alienWasDefeated = false;
  for (const bullet of state.enemyBullets) {
    bullet.x += bullet.velocityX * deltaSeconds;
    const speedScale = state.upgrades.includes(Constants.Id.RunUpgrade.BULLET_DAMPENER)
      ? Constants.Entities.AlienVariant.BULLET_DAMPENER_MULTIPLIER
      : 1;
    bullet.y += bullet.velocityY * speedScale * deltaSeconds;
    if (bullet.reflected && state.alien !== null && intersects(bullet, state.alien)) {
      alienWasDefeated = hitAlienWithReflectedBullet(state, bullet);
      if (alienWasDefeated) break;
      continue;
    }
    if (!bullet.reflected && intersects(bullet, state.paddle)) {
      if (state.activeEffects.shieldCharges > 0) {
        state.activeEffects.shieldCharges -= 1;
        state.effects.flash = Math.max(state.effects.flash, 0.18);
        state.events.push(Constants.Id.GameEvent.WALL_HIT);
      } else {
        playerWasHit = true;
      }
    } else {
      awardNearMiss(state, bullet);
    }
    if (!playerWasHit && isBulletVisible(state, bullet)) remainingBullets.push(bullet);
  }
  state.enemyBullets = playerWasHit || alienWasDefeated ? [] : remainingBullets;
  return playerWasHit;
};
