import { Constants } from '../constants';
import type { GameState } from '../gameplay/types';
import { renderBrick } from './brick';
import { renderPowerup } from './powerup';
import { renderBall } from './ball';
import type { RenderAssets } from './assets';
import { renderPaddle } from './paddle';
import { getFinalTarget } from '../gameplay/systems/finalBrickAssist';
import { isDynamicBrick, renderCachedBrickLayer } from './brickLayer';
import { clamp01 } from '../utils/math';

const renderBricks = (context: CanvasRenderingContext2D, state: GameState, assets: RenderAssets): void => {
  const finalTarget = getFinalTarget(state);
  const glowEnabled = state.bricks.length <= Constants.Render.Performance.BRICK_GLOW_LIMIT;
  if (state.phase !== Constants.Id.GamePhase.COUNTDOWN) {
    renderCachedBrickLayer(context, state, assets.brickLayer, finalTarget, assets.brickBaseSprite, assets.brickOverlaySprites);
    for (const brick of state.bricks) {
      if (!isDynamicBrick(state, brick, finalTarget)) continue;
      renderBrick(context, brick, {
        isFinalTarget: brick === finalTarget,
        finalTargetTurns: state.finalTargetTurns,
        elapsedSeconds: state.elapsedSeconds,
        reducedMotion: state.reducedMotion,
        glowEnabled,
        baseSprite: assets.brickBaseSprite,
        overlaySprites: assets.brickOverlaySprites
      });
    }
    return;
  }

  const introProgress = 1 - state.countdownRemaining / Constants.Game.LEVEL_COUNTDOWN_SECONDS;
  for (const brick of state.bricks) {
    const stagger = brick.rowIndex * 0.08 + (brick.x / state.arena.width) * 0.16;
    const reveal = state.reducedMotion ? 1 : clamp01((introProgress - stagger) * 2.6);
    context.save();
    context.globalAlpha = reveal;
    context.translate(0, (1 - reveal) * -34);
    renderBrick(context, brick, {
      isFinalTarget: brick === finalTarget,
      finalTargetTurns: state.finalTargetTurns,
      elapsedSeconds: state.elapsedSeconds,
      reducedMotion: state.reducedMotion,
      glowEnabled,
      baseSprite: assets.brickBaseSprite,
      overlaySprites: assets.brickOverlaySprites
    });
    context.restore();
  }
};

export const renderEntities = (context: CanvasRenderingContext2D, state: GameState, assets: RenderAssets): void => {
  const finalTarget = getFinalTarget(state) ?? undefined;
  const heatProgress = state.returnStreak / Constants.Game.RallyHeat.MAX_RETURNS;
  const overdrive = state.activeEffects.overdriveRemaining > 0;
  for (const ball of [state.ball, ...state.extraBalls]) {
    const trailColors = { classic: Constants.Render.Colors.FOREGROUND, neon: Constants.Render.Colors.TRAIL_NEON, ember: Constants.Render.Colors.TRAIL_EMBER, rainbow: `hsl(${(state.elapsedSeconds * 150) % 360} 90% 65%)` } as const;
    for (const point of ball.trail) {
      context.globalAlpha = Math.min(finalTarget === undefined ? 0.55 + heatProgress * 0.3 : 0.8, point.life * (finalTarget === undefined ? 2.5 + heatProgress : 3.5));
      context.fillStyle = ball.frozenSlowRemaining > 0
        ? Constants.Render.Colors.FROZEN_BALL
        : ball.boostSpeedRemaining > 0
          ? Constants.Render.Colors.BOOSTED_BALL
          : overdrive || ball.isCharged
            ? Constants.Render.Colors.CHARGED_BALL
            : ball.isSuper || ball.perfectSuper
              ? Constants.Render.Colors.SUPER_BALL
              : finalTarget === undefined ? trailColors[state.trailStyle] : Constants.Render.Colors.SHIELD;
      context.beginPath();
      context.arc(point.x, point.y, Math.max(1, point.life * (ball.isCharged ? 20 : 13 + heatProgress * 7)), 0, Math.PI * 2);
      context.fill();
    }
  }
  context.globalAlpha = 1;

  if (state.phase === Constants.Id.GamePhase.LIFE_LOST) {
    renderBricks(context, state, assets);
    return;
  }

  renderPaddle(context, state.paddle, state.activeEffects, state.effects, state.reducedMotion, assets.paddleSprites, state.paddleVelocityX);

  for (const ball of [state.ball, ...state.extraBalls]) {
    renderBall(context, ball, assets.ballSprites, overdrive, state.effects.ballImpact, state.effects.chargePulse, state.reducedMotion);
  }

  if (state.effects.nearMissGlow > 0) {
    const centerX = state.ball.x + state.ball.width / 2;
    const centerY = state.ball.y + state.ball.height / 2;
    context.save();
    context.globalAlpha = state.effects.nearMissGlow * 0.8;
    context.strokeStyle = Constants.Render.Colors.SHIELD;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(centerX, centerY, 10 + (1 - state.effects.nearMissGlow) * 18, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  renderBricks(context, state, assets);

  for (const powerup of state.powerups) {
    renderPowerup(context, powerup, assets.powerupSprites);
  }

  context.fillStyle = Constants.Render.Colors.LASER;
  for (const projectile of state.projectiles) context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);

  if (state.activeEffects.shieldCharges > 0) {
    context.strokeStyle = Constants.Render.Colors.SHIELD;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, state.arena.height - 3);
    context.lineTo(state.arena.width, state.arena.height - 3);
    context.stroke();
  }
};
