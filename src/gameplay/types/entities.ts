import { Id } from '../../constants/identifiers';
import type { Rectangle, Velocity } from './geometry';

type IdentifierValue<T> = T[keyof T];

export type TrailPoint = { x: number; y: number; life: number };

export type Ball = Rectangle & {
  velocity: Velocity;
  launched: boolean;
  pendingLaunchDirection: 'angled' | 'perpendicular';
  isSuper: boolean;
  perfectSuper: boolean;
  isCharged: boolean;
  trail: TrailPoint[];
  portalCooldown: number;
  frozenSlowRemaining: number;
  boostSpeedRemaining: number;
};

export type Paddle = Rectangle;
export type PowerupType = IdentifierValue<typeof Id.PowerupType>;
export type BrickBehavior = IdentifierValue<typeof Id.BrickBehavior>;
export type BrickDirection = IdentifierValue<typeof Id.BrickDirection>;

export type Brick = Rectangle & {
  hitPoints: number;
  maxHitPoints: number;
  points: number;
  rowIndex: number;
  behavior: BrickBehavior;
  baseX: number;
  moveDirection: -1 | 1;
  lastHitAt: number;
  powerup?: PowerupType;
  portalId?: string;
  direction?: BrickDirection;
};

export type Powerup = Rectangle & { type: PowerupType };
export type Projectile = Rectangle;
export type AlienKind = IdentifierValue<typeof Id.AlienKind>;

export type Alien = Rectangle & {
  kind: AlienKind;
  velocityX: number;
  shootRemaining: number;
  shotAnimationRemaining: number;
  shotPatternIndex: number;
  isBoss: boolean;
  hitPoints: number;
  maxHitPoints: number;
};

export type EnemyBullet = Rectangle & {
  velocityX: number;
  velocityY: number;
  reflected: boolean;
  nearMissAwarded: boolean;
};

export type TrailStyle = IdentifierValue<typeof Id.TrailStyle>;
