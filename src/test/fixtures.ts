import { Constants } from '../constants';
import type { LevelDefinition } from '../data/validateLevel';
import { createGameState } from '../gameplay/gameState';
import type { Alien, Ball, Brick, EnemyBullet, GameState, Paddle, Powerup } from '../gameplay/types';

export const createTestLevel = (): LevelDefinition => [[{ hitPoints: 1 }, null, null, null, null, null, null, null, null, null]];

export const createTestPaddle = (overrides: Partial<Paddle> = {}): Paddle => ({
  x: (Constants.Game.Arena.BASELINE.width - Constants.Entities.Paddle.WIDTH) / 2,
  y: 480,
  width: 80,
  height: 20,
  ...overrides
});

export const createTestBall = (overrides: Partial<Ball> = {}): Ball => ({
  x: (Constants.Game.Arena.BASELINE.width - Constants.Entities.Ball.SIZE) / 2,
  y: 470,
  width: 10,
  height: 10,
  velocity: { x: 0, y: -240 },
  launched: true,
  pendingLaunchDirection: 'angled',
  isSuper: false,
  perfectSuper: false,
  isCharged: false,
  trail: [],
  portalCooldown: 0,
  frozenSlowRemaining: 0,
  boostSpeedRemaining: 0,
  ...overrides
});

export const createTestBrick = (overrides: Partial<Brick> = {}): Brick => ({
  x: 0,
  y: 50,
  width: 50,
  height: 20,
  hitPoints: 1,
  maxHitPoints: 1,
  points: 10,
  rowIndex: 0,
  behavior: 'normal',
  baseX: 0,
  moveDirection: 1,
  lastHitAt: 0,
  ...overrides
});

export const createTestPowerup = (overrides: Partial<Powerup> = {}): Powerup => ({
  x: 220,
  y: 480,
  width: Constants.Entities.Powerup.WIDTH,
  height: Constants.Entities.Powerup.HEIGHT,
  type: 'expand',
  ...overrides
});

export const createTestAlien = (overrides: Partial<Alien> = {}): Alien => ({
  kind: 'scout',
  x: 100,
  y: 235,
  width: Constants.Entities.Alien.WIDTH,
  height: Constants.Entities.Alien.HEIGHT,
  velocityX: 82,
  shootRemaining: 1,
  shotAnimationRemaining: 0,
  shotPatternIndex: 0,
  isBoss: false,
  hitPoints: 1,
  maxHitPoints: 1,
  ...overrides
});

export const createTestEnemyBullet = (overrides: Partial<EnemyBullet> = {}): EnemyBullet => ({
  x: 220,
  y: 480,
  width: 6,
  height: 14,
  velocityX: 0,
  velocityY: Constants.Entities.EnemyBullet.SPEED,
  reflected: false,
  nearMissAwarded: false,
  ...overrides
});

export const createTestGameState = (overrides: Partial<GameState> = {}): GameState => ({
  ...createGameState({ level: createTestLevel(), phase: 'playing' }),
  phase: 'playing',
  countdownRemaining: 0,
  ...overrides
});
