import { Constants } from '../constants';
import { getAlienY, getDefaultArena } from '../gameplay/arena';
import type { Alien, AlienEntrySide, AlienKind, ArenaDimensions, EnemyBullet } from '../gameplay/types';
import { AlienRegistry, StandardAlienKinds } from './alienRegistry';

export const getNextAlienSpawnDelay = (random = Math.random): number =>
  Constants.Entities.Alien.MIN_SPAWN_SECONDS +
  random() * (Constants.Entities.Alien.MAX_SPAWN_SECONDS - Constants.Entities.Alien.MIN_SPAWN_SECONDS);

export type CreateAlienOptions = {
  random?: () => number;
  entrySide?: AlienEntrySide;
  isBoss?: boolean;
  arena?: ArenaDimensions;
  kind?: AlienKind;
};

export const getAlienKind = (levelIndex: number, random = Math.random): AlienKind => {
  const unlockedCount = Math.min(StandardAlienKinds.length, 1 + Math.floor(levelIndex / 2));
  return StandardAlienKinds[Math.floor(random() * unlockedCount)] ?? Constants.Id.AlienKind.SCOUT;
};

export const createAlien = (options: CreateAlienOptions = {}): Alien => {
  const {
    random = Math.random,
    entrySide,
    isBoss = false,
    arena = getDefaultArena(),
    kind = isBoss ? Constants.Id.AlienKind.BOSS : Constants.Id.AlienKind.SCOUT
  } = options;
  const resolvedKind = isBoss ? Constants.Id.AlienKind.BOSS : kind;
  const definition = AlienRegistry[resolvedKind];
  const entersFromLeft = entrySide === undefined ? random() < 0.5 : entrySide === 'left';
  return {
    kind: resolvedKind,
    x: entersFromLeft ? -definition.width : arena.width,
    y: getAlienY(arena),
    width: definition.width,
    height: definition.height,
    velocityX: (entersFromLeft ? 1 : -1) * definition.speed,
    shootRemaining: definition.fireIntervalSeconds * (0.5 + random() * 0.5),
    shotAnimationRemaining: 0,
    shotPatternIndex: 0,
    isBoss,
    hitPoints: definition.hitPoints,
    maxHitPoints: definition.hitPoints
  };
};

export const createEnemyBullet = (alien: Alien, velocityX = 0): EnemyBullet => ({
  x: alien.x + alien.width / 2 - Constants.Entities.EnemyBullet.WIDTH / 2,
  y: alien.y + alien.height,
  width: Constants.Entities.EnemyBullet.WIDTH,
  height: Constants.Entities.EnemyBullet.HEIGHT,
  velocityX,
  velocityY: Constants.Entities.EnemyBullet.SPEED,
  reflected: false,
  nearMissAwarded: false
});
