import { Constants } from '../../constants';
import { createAlien, createEnemyBullet, getAlienDefinition, getAlienKind, getNextAlienSpawnDelay } from '../../entities';
import { intersects } from '../collisions';
import { nextRandom } from '../random';
import type { AlienEntrySide, GameState } from '../types';
import { clamp } from '../../utils/math';

const chooseAlienEntrySide = (random = Math.random): AlienEntrySide => random() < 0.5 ? 'left' : 'right';

const getNextBossBulletVelocity = (state: GameState): number => {
  const alien = state.alien;
  if (alien === null) return 0;
  const angles = Constants.Entities.EnemyBullet.BOSS_PATTERN_ANGLES_DEGREES;
  const angleDegrees = angles[alien.shotPatternIndex % angles.length] ?? 0;
  alien.shotPatternIndex = (alien.shotPatternIndex + 1) % angles.length;
  return Constants.Entities.EnemyBullet.SPEED * Math.tan(angleDegrees * Math.PI / 180);
};

const alienHasExited = (state: GameState): boolean => {
  const alien = state.alien;
  if (alien === null || alien.isBoss) return false;
  return alien.velocityX > 0 ? alien.x > state.arena.width : alien.x + alien.width < 0;
};

const updateAlienSpawn = (state: GameState, deltaSeconds: number): void => {
  const spawnRate = state.stageModifier === Constants.Id.StageModifier.ALIEN_SWARM
    ? 1 / Constants.Entities.AlienVariant.SWARM_SPAWN_MULTIPLIER
    : 1;
  state.alienSpawnRemaining -= deltaSeconds * spawnRate;
  if (state.alienSpawnRemaining <= Constants.Game.ALIEN_WARNING_SECONDS && state.alienWarningSide === null) {
    state.alienWarningSide = chooseAlienEntrySide(() => nextRandom(state));
    state.events.push(Constants.Id.GameEvent.ALIEN_WARNING);
  }
  if (state.alienSpawnRemaining > 0) return;
  const isBossRound = (state.levelIndex + 1) % Constants.Game.Boss.LEVEL_INTERVAL === 0 && !state.bossDefeated;
  const random = (): number => nextRandom(state);
  state.alien = createAlien({
    random,
    entrySide: state.alienWarningSide ?? undefined,
    isBoss: isBossRound,
    arena: state.arena,
    kind: getAlienKind(state.levelIndex, random)
  });
  state.alienWarningSide = null;
};

const fireAlienWeapon = (state: GameState): void => {
  const alien = state.alien;
  if (alien === null) return;
  const definition = getAlienDefinition(alien);
  const velocities = definition.weapon === 'boss-pattern'
    ? [getNextBossBulletVelocity(state)]
    : definition.weapon === 'spread'
      ? [-Constants.Entities.AlienVariant.GUNNER_SPREAD, Constants.Entities.AlienVariant.GUNNER_SPREAD]
      : [0];
  state.enemyBullets.push(...velocities.map((velocity) => createEnemyBullet(alien, velocity)));
  const swarmMultiplier = state.stageModifier === Constants.Id.StageModifier.ALIEN_SWARM
    ? Constants.Entities.AlienVariant.SWARM_SPAWN_MULTIPLIER
    : 1;
  alien.shootRemaining = definition.fireIntervalSeconds * swarmMultiplier;
  alien.shotAnimationRemaining = Constants.Animation.Alien.ATTACK_FRAME_SECONDS;
  state.events.push(Constants.Id.GameEvent.ALIEN_SHOT);
};

const updateActiveAlien = (state: GameState, deltaSeconds: number): void => {
  const alien = state.alien;
  if (alien === null) return;
  alien.shotAnimationRemaining = Math.max(0, alien.shotAnimationRemaining - deltaSeconds);
  alien.x += alien.velocityX * deltaSeconds;
  if (alien.kind === Constants.Id.AlienKind.THIEF) {
    state.powerups = state.powerups.filter((powerup) => !intersects(alien, powerup));
  }
  if (alien.isBoss && (alien.x <= 0 || alien.x + alien.width >= state.arena.width)) {
    alien.x = clamp(alien.x, 0, state.arena.width - alien.width);
    alien.velocityX *= -1;
  }
  alien.shootRemaining -= deltaSeconds;
  const isVisible = alien.x + alien.width > 0 && alien.x < state.arena.width;
  if (alien.shootRemaining <= 0 && isVisible) fireAlienWeapon(state);
  if (!alienHasExited(state)) return;
  state.alien = null;
  state.alienWarningSide = null;
  state.alienSpawnRemaining = getNextAlienSpawnDelay();
};

export const updateAlienActor = (state: GameState, deltaSeconds: number): void => {
  if (state.alien === null) updateAlienSpawn(state, deltaSeconds);
  else updateActiveAlien(state, deltaSeconds);
};
