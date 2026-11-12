import { Constants } from '../../constants';
import type { Brick, GameState, PowerupType } from '../types';
import { nextRandom } from '../random';

const brickColor = (brick: Brick): string =>
  Constants.Render.Colors.BRICK_ROWS[brick.rowIndex % Constants.Render.Colors.BRICK_ROWS.length] ?? Constants.Render.Colors.PARTICLE;

export const spawnBrickHitEffects = (state: GameState, brick: Brick): void => {
  if (state.reducedMotion) return;
  const color = brickColor(brick);
  for (let index = 0; index < Constants.Animation.Brick.HIT_PARTICLE_COUNT; index += 1) {
    const angle = Math.PI + nextRandom(state) * Math.PI;
    const speed = Constants.Animation.Brick.HIT_PARTICLE_MIN_SPEED + nextRandom(state) * Constants.Animation.Brick.HIT_PARTICLE_SPEED_RANGE;
    state.effects.particles.push({
      x: brick.x + brick.width / 2,
      y: brick.y + brick.height / 2,
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      life: Constants.Animation.Brick.HIT_PARTICLE_MIN_LIFE_SECONDS + nextRandom(state) * Constants.Animation.Brick.HIT_PARTICLE_LIFE_RANGE_SECONDS,
      size: 1 + nextRandom(state) * 2,
      color
    });
  }
};

export const spawnBrickEffects = (state: GameState, brick: Brick, points: number): void => {
  const color = brickColor(brick);
  if (!state.reducedMotion) {
    const behaviorParticleBonus: Partial<Record<Brick['behavior'], number>> = { armored: 6, explosive: 10, portal: 8, directional: 4 };
    const particleCount = 12 + Math.min(8, state.combo) + (behaviorParticleBonus[brick.behavior] ?? 0);
    for (let index = 0; index < particleCount; index += 1) {
      const baseAngle = (Math.PI * 2 * index) / particleCount;
      const directionalAngle = brick.direction === 'left' ? Math.PI : brick.direction === 'right' ? 0 : brick.direction === 'down' ? Math.PI / 2 : -Math.PI / 2;
      const angle = brick.behavior === 'directional'
        ? directionalAngle + (nextRandom(state) - 0.5) * 0.55
        : baseAngle + nextRandom(state) * 0.25;
      const speed = brick.behavior === 'portal' ? 35 + nextRandom(state) * 70 : 45 + nextRandom(state) * 110;
      state.effects.particles.push({
        x: brick.x + brick.width / 2,
        y: brick.y + brick.height / 2,
        velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 0.55 + nextRandom(state) * 0.25,
        size: brick.behavior === 'armored' ? 4 + nextRandom(state) * 4 : brick.behavior === 'frozen' ? 1 + nextRandom(state) * 5 : 2 + nextRandom(state) * 3,
        color: brick.behavior === 'frozen' ? '#bae6fd' : brick.behavior === 'armored' ? '#cbd5e1' : color
      });
    }
    state.effects.shake = Math.max(state.effects.shake, brick.behavior === 'explosive' ? 10 : 4);
    state.effects.cameraZoom = Math.max(state.effects.cameraZoom, brick.behavior === 'explosive' ? Constants.Game.Camera.BOSS_ZOOM : Constants.Game.Camera.IMPACT_ZOOM * 0.45);
    state.effects.cameraKickX = (nextRandom(state) - 0.5) * (brick.behavior === 'explosive' ? 12 : 4);
    state.effects.cameraKickY = brick.behavior === 'explosive' ? 7 : 2;
  }
  if ((brick.behavior === 'explosive' || brick.behavior === 'portal' || brick.behavior === 'directional') && !state.reducedMotion) {
    state.effects.shockwaves.push({
      x: brick.x + brick.width / 2,
      y: brick.y + brick.height / 2,
      radius: 8,
      speed: brick.behavior === 'portal' ? -70 : 170,
      life: brick.behavior === 'portal' ? 0.7 : 0.55,
      color
    });
  }
  state.effects.floatingTexts.push({
    x: brick.x + brick.width / 2,
    y: brick.y,
    text: `+${points}`,
    life: 0.8,
    color
  });
  state.effects.flash = Math.max(state.effects.flash, 0.12);
};

export const spawnLevelClearEffects = (state: GameState): void => {
  state.effects.banner = { text: 'LEVEL CLEAR', color: Constants.Render.Colors.SHIELD, remaining: 1.25 };
  state.effects.backgroundPulse = 1;
  if (state.reducedMotion) return;
  state.effects.shockwaves.push({
    x: state.arena.width / 2,
    y: state.arena.height / 2,
    radius: 20,
    speed: 520,
    life: 0.85,
    color: Constants.Render.Colors.FOREGROUND
  });
  for (let index = 0; index < 60; index += 1) {
    const color = Constants.Render.Colors.BRICK_ROWS[index % Constants.Render.Colors.BRICK_ROWS.length] ?? '#fff';
    state.effects.particles.push({
      x: nextRandom(state) * state.arena.width,
      y: state.arena.height * 0.45,
      velocity: { x: (nextRandom(state) - 0.5) * 180, y: -80 - nextRandom(state) * 180 },
      life: 1 + nextRandom(state),
      size: 3 + nextRandom(state) * 4,
      color
    });
  }
};

export const spawnPaddleEffects = (state: GameState, x: number, color: string): void => {
  if (state.reducedMotion) return;
  for (let index = 0; index < 8; index += 1) {
    const direction = index % 2 === 0 ? -1 : 1;
    state.effects.particles.push({
      x,
      y: state.paddle.y,
      velocity: { x: direction * (30 + index * 8), y: -55 - index * 7 },
      life: 0.35 + index * 0.02,
      size: 2 + (index % 3),
      color
    });
  }
};

export const spawnPaddleDeathEffects = (state: GameState): void => {
  const color = state.activeEffects.laserRemaining > 0
    ? Constants.Render.Colors.LASER
    : state.activeEffects.stickyRemaining > 0 ? Constants.Render.Colors.STICKY : Constants.Render.Colors.FOREGROUND;
  const fragmentCount = state.reducedMotion ? 10 : 22;
  const fragmentWidth = state.paddle.width / fragmentCount;
  for (let index = 0; index < fragmentCount; index += 1) {
    const normalizedX = index / (fragmentCount - 1) * 2 - 1;
    state.effects.paddleFragments.push({
      x: state.paddle.x + index * fragmentWidth,
      y: state.paddle.y,
      velocity: {
        x: normalizedX * (95 + nextRandom(state) * 90),
        y: -105 - nextRandom(state) * 150
      },
      width: Math.max(3, fragmentWidth + 1),
      height: 4 + nextRandom(state) * 7,
      rotation: 0,
      angularVelocity: normalizedX * 8 + (nextRandom(state) - 0.5) * 7,
      life: Constants.Game.PADDLE_DEATH_SECONDS,
      color
    });
  }
  state.effects.shockwaves.push({
    x: state.paddle.x + state.paddle.width / 2,
    y: state.paddle.y + state.paddle.height / 2,
    radius: 6,
    speed: 240,
    life: 0.5,
    color
  });
};

export const spawnPowerupEffects = (state: GameState, type: PowerupType, label: string, color: string, source?: { x: number; y: number }): void => {
  state.effects.banner = { text: label.toUpperCase(), color, remaining: Constants.Game.POWERUP_BANNER_SECONDS };
  state.effects.flash = Math.max(state.effects.flash, 0.1);
  state.effects.backgroundPulse = Math.max(state.effects.backgroundPulse, 0.45);
  if (type === 'super-ball') state.effects.chargePulse = 1;
  if (state.reducedMotion) return;
  const paddleCenterX = state.paddle.x + state.paddle.width / 2;
  const targetY = state.paddle.y;
  const targetX = paddleCenterX;
  if (source !== undefined) {
    const offsetX = source.x - targetX;
    const offsetY = source.y - targetY;
    const startingRadius = Math.max(12, Math.hypot(offsetX, offsetY));
    const startingAngle = Math.atan2(offsetY, offsetX);
    for (let index = 0; index < Constants.Animation.Vortex.SPARK_COUNT; index += 1) {
      state.effects.vortexSparks.push({
        targetX,
        targetY,
        angle: startingAngle + index / Constants.Animation.Vortex.SPARK_COUNT * Math.PI * 2,
        radius: startingRadius * (0.55 + index / Constants.Animation.Vortex.SPARK_COUNT * 0.45),
        life: Constants.Animation.Vortex.LIFE_SECONDS,
        maxLife: Constants.Animation.Vortex.LIFE_SECONDS,
        color
      });
    }
  }
  for (let index = 0; index < 16; index += 1) {
    const angle = (Math.PI * 2 * index) / 16;
    state.effects.particles.push({
      x: targetX,
      y: targetY,
      velocity: { x: Math.cos(angle) * 90, y: Math.sin(angle) * 55 - 35 },
      life: 0.6,
      size: type === 'multiball' ? 4 : 3,
      color
    });
  }
};

export const spawnAlienEffects = (state: GameState, x: number, y: number, points: number): void => {
  if (!state.reducedMotion) {
    for (let index = 0; index < 20; index += 1) {
      const angle = (Math.PI * 2 * index) / 20;
      const speed = 70 + nextRandom(state) * 130;
      state.effects.particles.push({
        x,
        y,
        velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 0.7 + nextRandom(state) * 0.4,
        size: 2 + nextRandom(state) * 4,
        color: Constants.Render.Colors.ALIEN
      });
    }
    state.effects.shake = Math.max(state.effects.shake, 9);
    state.effects.cameraZoom = Math.max(state.effects.cameraZoom, Constants.Game.Camera.BOSS_ZOOM);
  }
  state.effects.flash = Math.max(state.effects.flash, 0.16);
  state.effects.floatingTexts.push({
    x,
    y,
    text: `ALIEN +${points}`,
    life: 1.1,
    color: Constants.Render.Colors.ALIEN
  });
};

export const spawnPerfectReturnEffects = (state: GameState, x: number): void => {
  state.effects.banner = { text: 'PERFECT RETURN', color: Constants.Render.Colors.SUPER_BALL, remaining: 0.7 };
  state.effects.backgroundPulse = Math.max(state.effects.backgroundPulse, 0.6);
  state.effects.cameraZoom = Math.max(state.effects.cameraZoom, Constants.Game.Camera.IMPACT_ZOOM);
  state.effects.cameraKickY = 6;
  state.effects.chargePulse = 1;
  if (state.reducedMotion) return;
  for (let index = 0; index < 12; index += 1) {
    const angle = Math.PI + (Math.PI * index) / 11;
    state.effects.particles.push({
      x,
      y: state.paddle.y,
      velocity: { x: Math.cos(angle) * 120, y: Math.sin(angle) * 120 },
      life: 0.5,
      size: 3,
      color: Constants.Render.Colors.SUPER_BALL
    });
  }
};

export const spawnComboMilestone = (state: GameState): void => {
  const labels: Record<number, string> = { 3: 'HOT!', 6: 'ON FIRE!', 10: 'UNSTOPPABLE!' };
  const label = labels[state.combo];
  if (label === undefined) return;
  state.effects.banner = { text: label, color: Constants.Render.Colors.SUPER_BALL, remaining: 0.9 };
  state.effects.backgroundPulse = 1;
};

export const spawnNearMissEffects = (state: GameState, x: number, y: number): void => {
  state.effects.banner = { text: `CLOSE CALL +${Constants.Game.NearMiss.POINTS}`, color: Constants.Render.Colors.ENEMY_BULLET, remaining: 0.75 };
  state.effects.floatingTexts.push({ x, y, text: `+${Constants.Game.NearMiss.POINTS}`, life: 0.7, color: Constants.Render.Colors.ENEMY_BULLET });
  state.effects.nearMissGlow = 1;
};

export const spawnLightningArc = (state: GameState, from: Brick, to: Brick): void => {
  state.effects.lightningArcs.push({
    fromX: from.x + from.width / 2,
    fromY: from.y + from.height / 2,
    toX: to.x + to.width / 2,
    toY: to.y + to.height / 2,
    life: 0.28
  });
};

