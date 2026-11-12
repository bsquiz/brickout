import { Constants } from '../constants';
import type { Alien, AlienKind } from '../gameplay/types';

export type AlienWeapon = 'single' | 'spread' | 'boss-pattern';
export type AlienDeathEffect = 'none' | 'split-shot' | 'boss-reward';

export type AlienDefinition = {
  spriteRow: 0 | 1 | 2 | 3 | 4 | 5;
  color: string;
  width: number;
  height: number;
  speed: number;
  hitPoints: number;
  points: number;
  fireIntervalSeconds: number;
  weapon: AlienWeapon;
  deathEffect: AlienDeathEffect;
};

export const AlienRegistry: Record<AlienKind, AlienDefinition> = {
  scout: {
    spriteRow: 0,
    color: Constants.Render.Colors.ALIEN,
    width: Constants.Entities.Alien.WIDTH,
    height: Constants.Entities.Alien.HEIGHT,
    speed: Constants.Entities.Alien.SPEED,
    hitPoints: 1,
    points: Constants.Entities.Alien.POINTS,
    fireIntervalSeconds: Constants.Entities.Alien.FIRE_INTERVAL_SECONDS,
    weapon: 'single',
    deathEffect: 'none'
  },
  gunner: {
    spriteRow: 1,
    color: '#fb7185',
    width: Constants.Entities.Alien.WIDTH,
    height: Constants.Entities.Alien.HEIGHT,
    speed: Constants.Entities.Alien.SPEED,
    hitPoints: 1,
    points: Constants.Entities.Alien.POINTS,
    fireIntervalSeconds: Constants.Entities.Alien.FIRE_INTERVAL_SECONDS,
    weapon: 'spread',
    deathEffect: 'none'
  },
  shielded: {
    spriteRow: 2,
    color: '#38bdf8',
    width: Constants.Entities.Alien.WIDTH,
    height: Constants.Entities.Alien.HEIGHT,
    speed: Constants.Entities.Alien.SPEED,
    hitPoints: Constants.Entities.AlienVariant.SHIELDED_HEALTH,
    points: Constants.Entities.Alien.POINTS,
    fireIntervalSeconds: Constants.Entities.Alien.FIRE_INTERVAL_SECONDS,
    weapon: 'single',
    deathEffect: 'none'
  },
  splitter: {
    spriteRow: 3,
    color: '#c084fc',
    width: Constants.Entities.Alien.WIDTH,
    height: Constants.Entities.Alien.HEIGHT,
    speed: Constants.Entities.Alien.SPEED,
    hitPoints: 1,
    points: Constants.Entities.Alien.POINTS,
    fireIntervalSeconds: Constants.Entities.Alien.FIRE_INTERVAL_SECONDS,
    weapon: 'single',
    deathEffect: 'split-shot'
  },
  thief: {
    spriteRow: 4,
    color: '#fbbf24',
    width: Constants.Entities.Alien.WIDTH,
    height: Constants.Entities.Alien.HEIGHT,
    speed: Constants.Entities.Alien.SPEED,
    hitPoints: 1,
    points: Constants.Entities.Alien.POINTS,
    fireIntervalSeconds: Constants.Entities.Alien.FIRE_INTERVAL_SECONDS,
    weapon: 'single',
    deathEffect: 'none'
  },
  boss: {
    spriteRow: 5,
    color: '#ff3cac',
    width: Constants.Entities.Alien.BOSS_WIDTH,
    height: Constants.Entities.Alien.BOSS_HEIGHT,
    speed: Constants.Entities.Alien.BOSS_SPEED,
    hitPoints: Constants.Game.Boss.HEALTH,
    points: Constants.Entities.Alien.BOSS_POINTS,
    fireIntervalSeconds: Constants.Entities.Alien.BOSS_FIRE_INTERVAL_SECONDS,
    weapon: 'boss-pattern',
    deathEffect: 'boss-reward'
  }
};

export const StandardAlienKinds = (Object.keys(AlienRegistry) as AlienKind[]).filter((kind) => kind !== Constants.Id.AlienKind.BOSS);

export const getAlienDefinition = (alien: Pick<Alien, 'kind' | 'isBoss'>): AlienDefinition =>
  AlienRegistry[alien.isBoss ? Constants.Id.AlienKind.BOSS : alien.kind];
