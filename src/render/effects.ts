import { Constants } from '../constants';
import type { GameState } from '../gameplay/types';
import { fillPlayableArea } from './primitives/area';

export const renderEffects = (context: CanvasRenderingContext2D, state: GameState): void => {
  for (const arc of state.effects.lightningArcs) {
    context.globalAlpha = Math.min(1, arc.life * Constants.Render.Effects.Lightning.LIFE_ALPHA_MULTIPLIER);
    context.strokeStyle = Constants.Render.Effects.Lightning.COLOR;
    context.lineWidth = Constants.Render.Effects.Lightning.LINE_WIDTH;
    context.beginPath();
    context.moveTo(arc.fromX, arc.fromY);
    for (let step = 1; step < Constants.Render.Effects.Lightning.SEGMENTS; step += 1) {
      const progress = step / Constants.Render.Effects.Lightning.SEGMENTS;
      const jitter = Constants.Render.Effects.Lightning.JITTER;
      context.lineTo(arc.fromX + (arc.toX - arc.fromX) * progress + (step % 2 === 0 ? -jitter : jitter), arc.fromY + (arc.toY - arc.fromY) * progress);
    }
    context.lineTo(arc.toX, arc.toY);
    context.stroke();
  }
  for (const shockwave of state.effects.shockwaves) {
    context.globalAlpha = Math.min(Constants.Render.Effects.Shockwave.MAX_ALPHA, shockwave.life);
    context.strokeStyle = shockwave.color;
    context.lineWidth = Constants.Render.Effects.Shockwave.BASE_LINE_WIDTH + shockwave.life * Constants.Render.Effects.Shockwave.LIFE_LINE_WIDTH;
    context.beginPath();
    context.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
    context.stroke();
  }
  for (const spark of state.effects.vortexSparks) {
    const progress = spark.life / spark.maxLife;
    const x = spark.targetX + Math.cos(spark.angle) * spark.radius;
    const y = spark.targetY + Math.sin(spark.angle) * spark.radius;
    context.globalAlpha = Math.min(1, progress * Constants.Render.Effects.Vortex.LIFE_ALPHA_MULTIPLIER);
    context.fillStyle = spark.color;
    context.shadowColor = spark.color;
    context.shadowBlur = Constants.Render.Effects.Vortex.SHADOW_BLUR;
    context.beginPath();
    context.arc(x, y, Constants.Render.Effects.Vortex.BASE_RADIUS + progress * Constants.Render.Effects.Vortex.LIFE_RADIUS, 0, Math.PI * 2);
    context.fill();
  }
  context.shadowBlur = 0;
  for (const particle of state.effects.particles) {
    context.globalAlpha = Math.min(1, particle.life * Constants.Render.Effects.PARTICLE_LIFE_ALPHA_MULTIPLIER);
    context.fillStyle = particle.color;
    context.fillRect(particle.x, particle.y, particle.size, particle.size);
  }
  for (const fragment of state.effects.paddleFragments) {
    context.save();
    context.globalAlpha = Math.min(1, fragment.life * Constants.Render.Effects.Fragment.LIFE_ALPHA_MULTIPLIER);
    context.fillStyle = fragment.color;
    context.shadowColor = fragment.color;
    context.shadowBlur = Constants.Render.Effects.Fragment.SHADOW_BLUR;
    context.translate(fragment.x + fragment.width / 2, fragment.y + fragment.height / 2);
    context.rotate(fragment.rotation);
    context.fillRect(-fragment.width / 2, -fragment.height / 2, fragment.width, fragment.height);
    context.restore();
  }
  for (const floatingText of state.effects.floatingTexts) {
    context.globalAlpha = Math.min(1, floatingText.life * Constants.Render.Effects.FloatingText.LIFE_ALPHA_MULTIPLIER);
    context.fillStyle = floatingText.color;
    context.font = Constants.Render.Effects.FloatingText.FONT;
    context.textAlign = 'center';
    context.fillText(floatingText.text, floatingText.x, floatingText.y);
  }
  context.globalAlpha = 1;

  if (state.effects.banner !== null) {
    const banner = state.effects.banner;
    const alpha = Math.min(1, banner.remaining * Constants.Render.Effects.Banner.FADE_MULTIPLIER);
    context.globalAlpha = alpha;
    context.fillStyle = Constants.Render.Effects.Banner.BACKGROUND;
    context.fillRect(state.arena.width / 2 - Constants.Render.Effects.Banner.X_OFFSET, state.arena.height / 2 - Constants.Render.Effects.Banner.Y_OFFSET, Constants.Render.Effects.Banner.WIDTH, Constants.Render.Effects.Banner.HEIGHT);
    context.strokeStyle = banner.color;
    context.lineWidth = Constants.Render.Effects.Banner.LINE_WIDTH;
    context.strokeRect(state.arena.width / 2 - Constants.Render.Effects.Banner.X_OFFSET, state.arena.height / 2 - Constants.Render.Effects.Banner.Y_OFFSET, Constants.Render.Effects.Banner.WIDTH, Constants.Render.Effects.Banner.HEIGHT);
    context.fillStyle = banner.color;
    context.font = Constants.Render.Effects.Banner.FONT;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(banner.text, state.arena.width / 2, state.arena.height / 2 - Constants.Render.Effects.Banner.TEXT_Y_OFFSET);
    context.globalAlpha = 1;
  }

  if (state.effects.flash > 0 && !state.reducedMotion) {
    context.fillStyle = `rgb(255 255 255 / ${Math.min(Constants.Render.Effects.FLASH_MAX_ALPHA, state.effects.flash)})`;
    fillPlayableArea(context, state.arena);
  }

  if (state.lives === 1) {
    const centerX = state.arena.width / 2;
    const centerY = state.arena.height / 2;
    const danger = context.createRadialGradient(centerX, centerY, Constants.Render.Effects.Danger.INNER_RADIUS, centerX, centerY, Math.max(state.arena.width, state.arena.height) * Constants.Render.Effects.Danger.OUTER_RADIUS_SCALE);
    danger.addColorStop(0, Constants.Render.Effects.Danger.INNER_COLOR);
    danger.addColorStop(1, `rgb(244 63 94 / ${state.reducedMotion ? Constants.Render.Effects.Danger.REDUCED_MOTION_ALPHA : Constants.Render.Effects.Danger.BASE_ALPHA + Math.sin(state.elapsedSeconds * Constants.Render.Effects.Danger.PULSE_FREQUENCY) * Constants.Render.Effects.Danger.PULSE_ALPHA_RANGE})`);
    context.fillStyle = danger;
    fillPlayableArea(context, state.arena);
  }
  if (state.effects.lifeFlash > 0) {
    context.fillStyle = `rgb(244 63 94 / ${state.effects.lifeFlash * Constants.Render.Effects.Danger.LIFE_FLASH_ALPHA})`;
    context.fillRect(0, 0, state.arena.width, state.arena.height);
  }
};
