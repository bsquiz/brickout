import { Constants } from '../constants';
import { getAlienDefinition } from '../entities';
import type { Alien } from '../gameplay/types';
import { drawAlienVisual } from './alienSprite';
import { drawProgressBar } from './primitives/progressBar';
import { applyCenteredTransform } from './primitives/transform';

export type RenderAlienOptions = {
  elapsedSeconds?: number;
  damageFlash?: number;
  reducedMotion?: boolean;
  sprites?: HTMLImageElement;
};

const calculateBob = (elapsedSeconds: number, reducedMotion: boolean): number =>
  reducedMotion
    ? 0
    : Math.sin(elapsedSeconds * Constants.Animation.Alien.BOB_FREQUENCY) * Constants.Animation.Alien.BOB_DISTANCE;

const calculateDamageScale = (reducedMotion: boolean, damageFlash: number): number =>
  reducedMotion ? 1 : 1 + damageFlash * Constants.Animation.Alien.DAMAGE_SCALE;

const calculateAlienAlpha = (elapsedSeconds: number): number =>
  Constants.Animation.Alien.FLICKER_BASE_ALPHA +
  Math.sin(elapsedSeconds * Constants.Animation.Alien.FLICKER_FREQUENCY) * Constants.Animation.Alien.FLICKER_ALPHA_RANGE;

const shouldAlienFlicker = (hitPoints: number, maxHitPoints: number, reducedMotion: boolean): boolean =>
  hitPoints / maxHitPoints <= Constants.Animation.Alien.CRITICAL_HEALTH_RATIO && !reducedMotion;

const renderBossHealth = (context: CanvasRenderingContext2D, alien: Alien): void => {
  if (!alien.isBoss) return;
  drawProgressBar(context, {
    x: alien.x,
    y: alien.y - Constants.Render.Alien.BOSS_HEALTH_Y_OFFSET,
    width: alien.width,
    height: Constants.Render.Alien.BOSS_HEALTH_HEIGHT,
    progress: alien.hitPoints / alien.maxHitPoints,
    backgroundColor: Constants.Render.Alien.BOSS_HEALTH_BACKGROUND,
    foregroundColor: Constants.Render.Colors.ENEMY_BULLET
  });
};

export const renderAlien = (
  context: CanvasRenderingContext2D,
  alien: Alien,
  options: RenderAlienOptions = {}
): void => {
  const { elapsedSeconds = 0, damageFlash = 0, reducedMotion = false, sprites } = options;
  const color = getAlienDefinition(alien).color;
  const damageScale = calculateDamageScale(reducedMotion, damageFlash);
  const damageSquash = 1 - (damageScale - 1);
  const bob = calculateBob(elapsedSeconds, reducedMotion);

  context.save();
  applyCenteredTransform(context, alien, { scaleX: damageScale, scaleY: damageSquash, offsetY: bob });

  if (shouldAlienFlicker(alien.hitPoints, alien.maxHitPoints, reducedMotion)) {
    context.globalAlpha = calculateAlienAlpha(elapsedSeconds);
  }

  context.shadowColor = color;
  context.shadowBlur = Constants.Render.Alien.GLOW_BLUR;
  drawAlienVisual(context, alien, color, elapsedSeconds, reducedMotion, sprites);
  context.shadowBlur = 0;
  renderBossHealth(context, alien);
  context.restore();
};
