import type { Brick } from './entities';
import type { Velocity } from './geometry';

export type Particle = { x: number; y: number; velocity: Velocity; life: number; size: number; color: string };
export type FloatingText = { x: number; y: number; text: string; life: number; color: string };
export type Shockwave = { x: number; y: number; radius: number; speed: number; life: number; color: string };

export type PaddleFragment = {
  x: number;
  y: number;
  velocity: Velocity;
  width: number;
  height: number;
  rotation: number;
  angularVelocity: number;
  life: number;
  color: string;
};

export type StatusBanner = { text: string; color: string; remaining: number };
export type LightningArc = { fromX: number; fromY: number; toX: number; toY: number; life: number };
export type VortexSpark = { targetX: number; targetY: number; angle: number; radius: number; life: number; maxLife: number; color: string };
export type PendingExplosion = { brick: Brick; remaining: number };

export type VisualEffects = {
  particles: Particle[];
  floatingTexts: FloatingText[];
  shake: number;
  paddleImpact: number;
  paddleImpactX: number;
  ballImpact: number;
  chargePulse: number;
  alienDamageFlash: number;
  nearMissGlow: number;
  flash: number;
  lifeFlash: number;
  backgroundPulse: number;
  cameraZoom: number;
  cameraKickX: number;
  cameraKickY: number;
  shockwaves: Shockwave[];
  lightningArcs: LightningArc[];
  vortexSparks: VortexSpark[];
  paddleFragments: PaddleFragment[];
  banner: StatusBanner | null;
};

export type ActiveEffects = {
  stickyRemaining: number;
  slowMotionRemaining: number;
  laserRemaining: number;
  laserCooldown: number;
  shieldCharges: number;
  overdriveRemaining: number;
};
